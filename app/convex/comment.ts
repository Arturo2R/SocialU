import { v } from "convex/values";
import { internalAction, mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// import {PostComment} from "../index";
import { getCurrentUserOrThrow } from "./user";
import { WithoutSystemFields } from "convex/server";
import { getAnonimousUsername, likes, reactionOfPost } from "./post";
// import { generateSHA256Hash } from "../src/lib/utils";

export interface PostComment extends Omit<Doc<"comment">, "authorId">, likes {
  author: author | "anonimo";
  authorId?: string | undefined;
  subcomments: (PostComment | null)[] | null;
}

export interface author {
  name: string;
  username: string;
  id: string;
  image?: string;
}


export const get = query({
  args: {
    commentId: v.string(),
  },
  handler: async (ctx, args) => {
    let comment = await ctx.db.query("comment").filter(q => q.eq(q.field("postId"), args.commentId)).first();
    const creator = (comment?.anonimo && comment.authorId) ? await ctx.db.get(comment.authorId) : null;
    const business = (comment?.asOrganization && comment.organizationId) ? await ctx.db.get(comment.organizationId) : null;

    let author = (() => {
      if (comment?.asOrganization && business) {
        return {
          name: business?.name,
          id: business?._id,
          image: business?.logo,
          color: business?.color
        }
      } else if (comment?.anonimo === false) {
        const useUsername = creator?.settings?.useUserName ?? true;
        return {
          name: useUsername ? creator?.username : creator?.name,
          id: creator?.username || creator?.name,
          ...(creator?.photoURL && { image: creator.photoURL }),
        }
      } else if (comment?.anonimo === true) {
        return "anonimo"
      }
    })()
    return { ...comment, author }
  }
})

// export const generateAnonimousUserName = internalAction({
//   args: {
//     postId: v.id("post"),
//     username: v.string(),
//     postSlug: v.string(),
//     authorId: v.id("user"),
//   },
//   handler: async (ctx, args) => {
//     const post = await ctx.db.get(args.postId);
//     if (!post) { throw new Error("Post not found") }
//     const author = await ctx.db.get(args.authorId);
//     if (!author) { throw new Error("User not found") }

//     const anonimoName = `${author.username}_${post.slug}`;

//     return anonimoName;
//   }
// })

export const create = mutation({
  args: {
    content: v.string(),
    postId: v.id("post"),
    parentId: v.optional(v.id("comment")),
    anonimo: v.boolean(),
    asOrganization: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const author = await getCurrentUserOrThrow(ctx);
    const post = await ctx.db.get(args.postId);
    if (!post) { throw new Error("Post not found") }
    const anoimousId = await getAnonimousUsername(args.anonimo ? { username: author.username, slug: post.slug } : "skip")

    let payload = {
      authorId: author._id,
      content: args.content,
      postId: args.postId,
      parentId: args.parentId,
      anonimo: args.anonimo,
      asOrganization: args.asOrganization,
      ...((args.anonimo && anoimousId) && { authorAnonimousId: anoimousId })
    } as WithoutSystemFields<Doc<"comment">>;

    if (args.asOrganization) {
      const bussinessId = await ctx.db.query("organization").collect();
      const business = bussinessId.find((bussiness) => bussiness.members.includes(author._id));
      if (!business) { throw new Error("User is not a member of any organization") }
      payload = {
        ...payload,
        organizationId: business._id
      }
    }

    ctx.db.insert("comment", payload);
    ctx.db.patch(post._id, { commentsCounter: post.commentsCounter + 1 })
  }
})


export const getCommentsForPost = query({
  args: {
    postId: v.id("post"),
  },
  handler: async (ctx, { postId }) => {
    // Fetch all comments for the given post ID
    const comments = await ctx.db
      .query("comment")
      .withIndex("withPost", (q) => q.eq("postId", postId))
      .order("desc") // Assuming you want the comments in ascending order of creation time
      .collect();


    // Function to fetch author details
    const getAuthorDetails = async (authorId: Id<"user">, anonimo: boolean, organizationId?: Id<"organization">): Promise<author | "anonimo"> => {
      if (organizationId) {
        const organization = await ctx.db.get(organizationId);
        if (!organization) { throw new Error("Organization not found") }
        return {
          name: organization?.name,
          username: organization?.name,
          id: organization?._id,
          image: organization?.logo,
        } as author
      }
      if (anonimo) {
        return "anonimo"
      }
      const author = await ctx.db.get(authorId);
      if (!author) {
        return {
          name: "Deleted User",
          id: "ks7b67dbk7wfdhvk3rw73f6c2h70nrsb"
        } as author
      }
      return {
        name: (author?.settings?.useUserName ?? true) ? author.username : author?.displayName,
        id: author?.username || author?.name,
        ...(author?.photoURL && { image: author.photoURL }),
      } as author
    };
    // Function to build nested comments
    const buildNestedComments = async (parentId: Id<"comment"> | undefined): Promise<PostComment[]> => {
      const nestedComments = comments
        .filter(comment => comment.parentId === parentId)
        .map(async comment => {
          const author = await getAuthorDetails(comment.authorId, comment.anonimo, comment.organizationId);
          const children = await buildNestedComments(comment._id);
          const reactions = await reactionOfPost(ctx, comment._id) as likes;
          return {
            ...comment,
            author: author,
            subcomments: children,
            authorId: "nonnull",
            ...reactions,
          };

        });
      return Promise.all(nestedComments);
    };

    // Start building the nested comments from the top level (parentId = null)
    const nestedComments = await buildNestedComments(undefined);
    return nestedComments;
  }
});
