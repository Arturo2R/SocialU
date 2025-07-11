import { literals } from "convex-helpers/validators";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { snakeCase } from "lodash";
import config from "../src/lib/config";
import { nanoid } from "../src/lib/utils";
import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { action, internalAction, internalMutation, internalQuery, mutation, query, QueryCtx, } from "./_generated/server";
import schema from "./schema";
import { getCurrentUser, getCurrentUserOrThrow } from "./user";

// import {CohereClient} from "cohere-ai"

export type likes = {likes: number, dislikes: number, likedByTheUser?: "like" | "dislike" | undefined}

export interface POST extends Doc<"post"> {
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
        link: string;
        image?: string;
    };
    likes?: number;
    dislikes?: number;
    likedByTheUser: 'like' | 'dislike' | undefined;
}

const {categories} = config();
let lascategories = categories.map((category) => category.value)
// Return the las 20 posts in the publicPosts collection
export const getFeed = query({
    args: {
        filterbyCategory: v.optional(literals(...lascategories)),
        paginationOpts: paginationOptsValidator,
        search: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let results
        // let posts
        if(args.search) {
            if (args.filterbyCategory) {
                results = await ctx.db
                    .query("post")
                    .withSearchIndex("by_content", (q) => q.search("contentInMarkdown", args.search!).eq("categoryValue", args.filterbyCategory))
                    .paginate(args.paginationOpts)
            } else {
                results = await ctx.db
                    .query("post")
                    .withSearchIndex("by_content", (q) => q.search("contentInMarkdown", args.search!))
                    .paginate(args.paginationOpts)
            }
        } else {
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
        }

        const postsWithAuthors = await Promise.all(results.page.map(async (post) => {
            const PosT = await preparePost(ctx, post)
            // For anonymous posts, return the post as is
            return PosT;
        }));

        return {
            ...results,
            page: postsWithAuthors
        };
    }
})


export const reactionOfPost = async (ctx:QueryCtx, postId: Id<"post">| Id<"comment">) : Promise<likes>  => {
    const reactions = await ctx.db.query("reaction").withIndex("byContentId", (q) => q.eq("contentId", postId)).collect();

    const user = await getCurrentUser(ctx);
    let payload : likes = {likes: 0, dislikes: 0}
    
    if(reactions) {
        const likes = reactions.filter((reaction) => reaction.reaction_type === "like").length;
        const dislikes = reactions.filter((reaction) => reaction.reaction_type === "dislike").length;

        payload = {likes, dislikes}
        if(user) {
            const likedByTheUser = reactions.find((reaction) => reaction.userId === user._id);
            if (likedByTheUser) {
                payload = {...payload, likedByTheUser: likedByTheUser.reaction_type }
            }
        }
    }
    return payload
}


export const preparePost = async (ctx: QueryCtx, rawpost: Doc<"post">) : Promise<POST> => {
    const reactions = await reactionOfPost(ctx, rawpost._id)
    const authorId = rawpost.authorId
    let post : POST = {...rawpost, ...reactions, authorId: "nonull"} as POST

    if(post.asBussiness && post.organizationId){
        const business = await ctx.db.get(post.organizationId);
        if (!business) { throw new Error("Organization not found") }

        post = { ...post, asBussiness: true, organization: {
            displayName: business.name,
            userName: business.name,
            id: business._id,
            image: business.logo,
            color: business.color,
            link: business.url
        }};
    }

    if (!post.anonimo) {
        const author = await ctx.db.get(authorId);
        if (!author) { 
            post = { ...post, anonimo: false, author: {
                displayName: "Usuario eliminado",
                userName: "Usuarioeliminado",
                link: `https://redsocialu.net/`,
            }}
        } else {
            post = { ...post, anonimo: false, author: {
                displayName: author.settings?.useUserName ? author.username : author.displayName || author.username,
                userName: author.username,
                link: `https://redsocialu.net/${author.username}`,
                ...(author.photoURL && { image: author.photoURL }),
            }}
        }
    }
    return post
}


export const create = mutation({
    args: {
        renderMethod: v.optional(v.union(v.literal("DangerouslySetInnerHtml"),v.literal("NonEditableTiptap"),v.literal("none"),v.literal("CustomEditorJSParser") , v.literal("CustomTiptapParser"))),
        messageFormat: v.optional(v.union(v.literal("Markdown"),v.literal("HTML"),v.literal("Tiptap"), v.literal("EditorJS"))),
        title: v.optional(v.string()),
        anonimo: v.boolean(),
        asBussiness: v.boolean(),
        image: v.optional(v.string()),
        content: v.union(v.string(), v.array(v.any())),
        tags: v.optional(v.array(v.string())),
        contentInHtml: v.optional(v.string()),
        contentInMarkdown: v.optional(v.string()),
        video: v.optional(v.string()),  
        videoMetadata: v.optional(v.object({})),
    }, 
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx);
        const slug = args.title ? snakeCase(args.title) + nanoid(3) : await nanoid(7);
        const anoimousId = await getAnonimousUsername(args.anonimo ?  {username: user.username, slug} : "skip")
        let post = {
            ...args,
            contentInHtml: args.contentInHtml?.replace("<img", "<img loading='lazy' fetchpriority='low'") || "",
            categoryValue: args.tags?.[0],
            commentsCounter: 0,
            viewsCounter: 0,
            slug,
            authorId: user._id,
            likeText: {
                positive: "Me gusta",
                negative: "No me gusta"
            },
            ...((args.anonimo && anoimousId) && {authorAnonimousId: anoimousId}),
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

        // console.log(`${user.name} creó el post ${slug}`)
        const createdPost = await ctx.db.insert("post", post )
        await Promise.all([
            ctx.scheduler.runAfter(10, internal.reaction.generate, {content: post.contentInMarkdown || "", title: post.title || "", postId: createdPost}),
            ctx.scheduler.runAfter(700, internal.post.createEmbedding, {content: post.contentInMarkdown || "", type: "document", store: true, postId: createdPost})
        ])
    }
})

// import crypto from "SubtleCrypto"

export const getAnonimousUsername = async (args: { username: string, slug: string } | "skip"): Promise<string | undefined> => {
    if (args === "skip") {
        return undefined
    }
    
    const concatenated = args.username + args.slug
    const encoder = new TextEncoder();
    const data = encoder.encode(concatenated);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const id = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    return '@'+id.slice(0, 7)
}

export const revalidate = action({
    args: {
        author: v.string(),
        id: v.string(),
    },
    handler: (_, args) => {
        // do something with `args.a` and `args.b`
        fetch(`https://redsocialu.net/api/revalidate?secret=calandriel&id=${args.id}&author=${args.author}`)
        // optionally rredsocialu.net

        return "success";
    },
})

export const slugs = query({
    handler: async (ctx) => {
        const posts = await ctx.db.query("post").collect();
        return posts.map((post) => post.slug)
    }
})


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
        authorId: v.string(),
        author: v.optional(v.object({
            displayName: v.string(),
            userName: v.string(),
            link: v.string(),
            image: v.optional(v.string()),
        })),
        likes: v.optional(v.number()),
        dislikes: v.optional(v.number()),
        likedByTheUser: v.optional(literals("like", "dislike")),
    }),
    handler: async (ctx, args) => {
        let post = await ctx.db.query("post").filter(q=> q.eq(q.field("slug"), args.slug) ).first();
        if (!post) { throw new ConvexError("Post not found") }
        // const reactionCounter = await
        if (!post) { throw new Error("Post not found") }
       
        const PosT = await preparePost(ctx, post)

        return PosT 
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
        return isImageAdult
    }
})



import { VECTOR_SEARCH_LIMIT } from "../src/lib/constants";

export const vectorSearch = action({
    args: {
        search: v.string(),
        type: literals("post", "comment", "organization", "user", "scraped_pages"),
    },
    handler: async ( ctx, args): Promise<any> => {
        const embedding = await ctx.runAction(internal.post.createEmbedding, {content: args.search, type: "query"})
        let results = await ctx.vectorSearch("embeddings", "by_embedding", {
            vector: embedding,
            filter:  (q) => q.eq("artifactType", args.type),
            limit: VECTOR_SEARCH_LIMIT,
        })

        const searchPosts: Array<POST> = await ctx.runQuery(
            internal.post.fetchResults,
            { ids: results.map((result) => result._id) },
          );

        // console.log(`Embeddings: ${JSON.stringify(response.embeddings)}`);
        return searchPosts
    }
})

export const fetchResults = internalQuery({
    args: { ids: v.array(v.id("embeddings")) },
    handler: async (ctx, args) => {
      const results: Array<POST> = [];
      for (const id of args.ids) {
        const embed = await ctx.db.get(id)
        if (embed === null) {
          continue;
        }
        const doc = await ctx.db.get(embed.artifactId);
        if (doc === null) {
          continue;
        }
        const bakedPost = await preparePost(ctx, doc as Doc<"post">)
        results.push(bakedPost);
      }
      return results;
    },
  });


export const recreateAllEmbeddings = internalMutation({
    handler: async (ctx) => {
        const posts = await ctx.db.query("post").collect();
        let i = 10
        for (const post of posts) {
            await ctx.scheduler.runAfter(i, internal.post.createEmbedding, {content: post.contentInMarkdown || "", type: "document", store: true, postId: post._id})
            i += 1000
        }
    }
})

export const createEmbedding = internalAction({
    args: {
        content: v.string(),
        type: literals("query", "document"),
        store: v.optional(v.boolean()),
        postId: v.optional(v.id("post")),
    },
    handler: async (ctx, args) => {
        // With Cohere Deprecated now I will be using open source model jina ai embeddings 4 based on RoBERTa
        // const cohere = new CohereClient({
        //     token: process.env.COHERE_API_KEY, // This is your trial API key
        //   });
        // const response = await cohere.v2.embed({
        //     model: "embed-multilingual-light-v3.0",
        //     texts: [args.content || ""],
        //     inputType: args.type === "query" ? "search_query" : "classification",
        //     embeddingTypes: ["float"],
        //     truncate: "NONE"
        // });
        // console.log("Creating embedding")
        const url = 'https://api.jina.ai/v1/embeddings';
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': process.env.JINA_API_KEY || "",
        };
        const data = {
            model: 'jina-embeddings-v3',
            task: args.type === "query" ? 'retrieval.query' : "retrieval.passage",
            dimensions: 1024,
            late_chunking: true,
            embedding_type: 'float',
            input: [args.content || ""]
        };
        // console.log(data)

        const res = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        })
        const response = await res.json();
        // console.log(response)
        if(!response.data[0].embedding) {
            throw new Error("No embeddings generated")
        }
        if(args.store){
            if (args.postId) {
                await ctx.runMutation(internal.post.storeEmbedding, {postId: args.postId, embedding: response.data[0].embedding, type: "post"});
            } else {
                throw new Error("postId is undefined");
            }
        }
        return response.data[0].embedding
    }
})

export const storeEmbedding = internalMutation({
    args: {
        postId: v.id("post"),
        embedding: v.array(v.float64()),
        type: literals("post", "comment", "organization", "user", "scraped_pages"),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("embeddings", { artifactId: args.postId,  embedding: args.embedding, artifactType: args.type})
    }
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