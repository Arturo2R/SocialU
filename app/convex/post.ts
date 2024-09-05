import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {nanoid} from "../src/lib/utils"
import {snakeCase} from "lodash"
import { filter } from "convex-helpers/server/filter";
import { Doc, Id } from "./_generated/dataModel";
import { getCurrentUserOrThrow } from "./user";
import { internal } from "./_generated/api";
import { literals } from "convex-helpers/validators";
import schema from "./schema";
import config from "../src/lib/config"; 
import { paginationOptsValidator, SchemaDefinition } from "convex/server";

const {categories} = config();
let lascategories = categories.map((category) => category.value)
// Return the las 20 posts in the publicPosts collection
export const getFeed = query({
    args: {
        filterbyCategory: v.optional(literals(...lascategories)),
        paginationOpts: paginationOptsValidator
    },
    handler: async (ctx, args) => {
        let results
        // let posts

        if (args.filterbyCategory ) {
            results = await ctx.db
                .query("post")
                .withIndex("by_category", (q)=> q.eq("categoryValue", args.filterbyCategory  )  )
                .order("desc").paginate(args.paginationOpts)
        } else {
            results = await ctx.db
            .query("post")
            .order("desc").paginate(args.paginationOpts)
        }
        

        // if(args.filterbyCategory){
        //      posts = results.page.filter((post) => post.tags?.includes(args.filterbyCategory || "") || false)
        // }

        // let allposts = posts.map((post) => {
        //     const author = post.anonimo ? null : ctx.db.get(post.authorId)
        //     const business = (post.asBussiness && post.organizationId)? ctx.db.get(post.organizationId) : null;
        //     return {...post, author: (author ?? business)}
        // })
        
        const postsWithAuthors = await Promise.all(results.page.map(async (post) => {
            // If the post is not anonymous, fetch the author
            if(post.asBussiness && post.organizationId){
                const business = await ctx.db.get(post.organizationId);
                return { ...post, author: {
                    name: business?.name,
                    id: business?._id,
                    image: business?.logo,
                    color: business?.color
                } };
            }

            if (!post.anonimo) {
                const author = await ctx.db.get(post.authorId);
                if (!author) { throw new Error("Author not found") }
                // Attach the author to the post object
                return { ...post, author:{
                    name: author?.settings?.useUserName ? author.username : author.displayName,
                    id: author.username || author.name,
                    ...(author.photoURL && { image: author.photoURL }),
                },
                 anonimo: false,
                };
            }

            // For anonymous posts, return the post as is
            return post;
        }));

        return {
            ...results,
            page: postsWithAuthors
        };
    }
})


export const create = mutation({
    args: {
        renderMethod: v.optional(v.union(v.literal("DangerouslySetInnerHtml"),v.literal("NonEditableTiptap"),v.literal("none"), v.literal("CustomTiptapParser"))),
        messageFormat: v.optional(v.union(v.literal("Markdown"),v.literal("HTML"),v.literal("Tiptap"))),
        title: v.optional(v.string()),
        anonimo: v.boolean(),
        asBussiness: v.boolean(),
        image: v.optional(v.string()),
        content: v.union(v.string(), v.array(v.any())),
        tags: v.optional(v.array(v.string())),
        contentInHtml: v.optional(v.string()),
        contentInMarkdown: v.optional(v.string()),
    }, 
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx);
        const slug = snakeCase(args.title) || await nanoid(7);

        let post = {
            ...args,
            categoryValue: args.tags?.[0],
            commentsCounter: 0,
            viewsCounter: 0,
            slug,
            authorId: user._id,
        } as Doc<"post">

        if (args.asBussiness) {
            const bussinessId = await ctx.db.query("organization").collect()
            const business = bussinessId.find((bussiness) => bussiness.members.includes(user._id));
            if (!business) {throw new Error("User is not a member of any organization")}
            post = {
                ...post,
                organizationId: business._id,
            } 
        }
        ctx.db.insert("post", post )
    }
})

export const revalidate = action({
    args: {
        author: v.string(),
        id: v.string(),
    },
    handler: (_, args) => {
        // do something with `args.a` and `args.b`
        fetch(`https://redsocialu.com/api/revalidate?secret=calandriel&id=${args.id}&author=${args.author}`)
        // optionally return a value

        return "success";
    },
})

export const slugs = query({
    handler: async (ctx) => {
        const posts = await ctx.db.query("post").collect();
        return posts.map((post) => post.slug)
    }
})

interface userorg extends Doc<"post">  {

    organization: {
        displayName: string;
        userName: string;
        id: Id<"organization">;
        link: string;
        image?: string;
        color: string;
    };
}

interface justuser extends Doc<"post">  {
    author: {
        displayName: string;
        userName: string;
        id: Id<"user">;
        link: string;
        image?: string;
    };
}
interface anonimo extends Doc<"post">  {
    anonimo: true,
    author: "anonimo"
}

interface POST extends Doc<"post"> {
    organization?: {
        displayName: string;
        userName: string;
        id: Id<"organization">;
        link: string;
        image?: string;
        color: string;
    };
    author?: {
        displayName: string;
        userName: string;
        id: Id<"user">;
        link: string;
        image?: string;
    };
}

/**
 * Retrieves a post based on the provided slug.
 * 
 * @param {string} slug - The slug of the post.
 * @returns {Promise<Doc<"post"> |null>} - The post object if found, otherwise null.
 * @throws {Error} - If the post is not found.
 */
export const get = query({
    args: {
        slug: v.string(),
    },
    returns: v.object({
        _creationTime: v.number(),
        _id: v.id("post"),
        ...schema.tables.post.validator.fields,
        organization: v.optional(v.object({
            displayName: v.string(),
            userName: v.string(),
            id: v.id("organization"),
            link: v.string(),
            image: v.optional(v.string()),
            color: v.string(),
        })),
        author: v.optional(v.object({
            displayName: v.string(),
            userName: v.string(),
            id: v.id("user"),
            link: v.string(),
            image: v.optional(v.string()),
        })),
    }),
    handler: async (ctx, args) => {
        let post = await ctx.db.query("post").filter(q=> q.eq(q.field("slug"), args.slug) ).first();
        if (!post) { throw new Error("Post not found") }
       
        const creator = await ctx.db.get(post.authorId);
        if (!creator) { throw new Error("Author not found") }

        const business = (post.asBussiness && post.organizationId) ? await ctx.db.get(post.organizationId) : null;
        if (!business &&  (post.asBussiness && post.organizationId)) { throw new Error("Organization not found") }

        if (post.anonimo === true)  {
            post = post
        } else {
            post = {...post, anonimo: false, author: {
                displayName: creator.settings?.useUserName ? creator.username : creator.displayName || creator.username,
                userName: creator.username,
                id: creator._id,
                link: `https://redsocialu.com/${creator.username}`,
                ...(creator.photoURL && { image: creator.photoURL }),
                }
            } as justuser
            
        }


        if (post && business && post.asBussiness === true) {
            post = {...post, asBussiness: true, organization: {
                displayName: business.name, // Vanity Name
                userName: business.name, // Serius db name
                id: business._id,
                image: business.logo,
                color: business.color,
                link: business.url
                    }
                } as userorg
        }

        return post as POST
}})

export const addView = mutation({
    args: {
        slug: v.string(),
    },
    handler: async (ctx, args) => {
        const post = await ctx.db.query("post").filter(q=> q.eq(q.field("slug"), args.slug) ).first();
        if (!post) { throw new Error("Post not found") }
        ctx.db.patch(post._id, {viewsCounter: post.viewsCounter+1})
    },
})

export const generateUploadUrl = mutation({
    async handler(ctx) {
        getCurrentUserOrThrow(ctx);
        
        return await ctx.storage.generateUploadUrl()
    },
})

export const getFileUrl = mutation({
    args: {
        imageId: v.id("_storage"),
    }, 
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.imageId)
    }
})

export const checkImage = action({
    args: {
        url: v.optional(v.string()),
        id: v.optional(v.id("_storage")),
        inputType: v.union(v.literal("url"), v.literal("id")),
        cacheImage: v.optional(v.boolean())},
    async handler(ctx, args) {
        const user = await ctx.auth.getUserIdentity()

        if(!user) throw new Error("User not found")
        if(!args.url && !args.id) throw new Error("No url or id provided")
        if(args.inputType === "id" && !args.id) throw new Error("No id provided")
        if(args.inputType === "url" && !args.url) throw new Error("No url provided")


        let isImageAdult: boolean = false
        let url = args.url || ""

        if(args.inputType === "id" && args.id){
            let lulo = await ctx.storage.getUrl(args.id)
            if(lulo) url = lulo
        }

        let data = {
            "DataRepresentation": "URL",
            "Value": url
        };

        try {
            let response = await fetch(process.env.NEXT_PUBLIC_AZURE_NAP_URL + `/contentmoderator/moderate/v1.0/ProcessImage/Evaluate${args.cacheImage ? "?CacheImage=true" : ""}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_AZURE_NAP_KEY || "",
                },
                body: JSON.stringify(data)
            });
    
            let result = await response.json();
            isImageAdult = result.IsImageAdultClassified
        } catch (error) {
            console.error("Un error mirando la imagen", error)
            throw new Error("Un error mirando la imagen "+ error)
        }
        return !isImageAdult
    },
})






// export const addreaction = mutation({
//     args: {
//         postId: v.id("post"),
//         kind: literals("like", "dislike"),
//         content_type: literals("post", "comment"),
//         commentId: v.optional(v.id("comment")),
//     },
//     handler: async (ctx, args) => {
//         let user = await getCurrentUserOrThrow(ctx);

//         let searchAlreadyStoredReaction = await ctx.db.query("reaction")
//         .filter((q) => q.eq(q.field("userId"), user._id))
//         .first();

//         if (searchAlreadyStoredReaction){
//             if (searchAlreadyStoredReaction.reaction_type === args.kind){
//                 return "already reacted"
//             }
//             await ctx.db.delete("reaction", searchAlreadyStoredReaction._id)
//         }

//         if(args.kind === "like") {

//         }
        
//     }
// })


// export const addComment = mutation({
//     args: {
//         content: v.string(),
//         postId: v.id("post"),
//         anonimo: v.boolean(),
//         asOrganization: v.optional(v.boolean()),
//         authorId: v.id("user"),
//         parentId: v.optional(v.id("comment")),
//     },
//     handler: async (ctx, args) => {
//         if (args.asOrganization) {
//             const bussinessId = await ctx.db.query("organization").filter({members: args.authorId}).first();
//         }
//         const comment = await ctx.db.insert("comment", {
//             ...args,
//             timeFormat: "JSONDate"
//         });
//         return comment;
//     }
// })

// export const uploadImage = mutation({
//     args: {
//         image: v.string(),
//     },
//     handler: async (ctx, args) => {
        
//         return { imageData };
//     }
// })