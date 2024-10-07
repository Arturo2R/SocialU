import { v } from "convex/values"
import { defineSchema, defineTable } from "convex/server";
import { literals, optional } from "convex-helpers/validators";
import { authTables } from "@convex-dev/auth/server";
import config from "../src/lib/config";

const { categories } = config();
let lascategories = categories.map((category) => category.value)


export default defineSchema({
    // ...authTables,
    post: defineTable({
        anonimo: v.boolean(),
        asBussiness: v.boolean(),
        viewsCounter: v.number(),
        commentsCounter: v.number(),
        slug: v.string(),
        content: v.union(v.string(), v.array(v.any())),
        contentInMarkdown: v.optional(v.string()),
        contentInHtml: v.optional(v.string()),
        title: v.optional(v.string()),
        authorId: v.id("user"),
        tags: v.optional(v.array(v.string())),
        //categoryId: v.optional(v.id("category")),
        image: v.optional(v.string()),
        imageData: v.optional(v.object({ height: v.float64(), width: v.float64() })),
        organizationId: v.optional(v.id("organization")),
        priority: v.optional(v.boolean()),
        renderMethod: literals("DangerouslySetInnerHtml", "NonEditableTiptap", "none", "CustomTiptapParser", "CustomEditorJSParser"),
        messageFormat: literals("Markdown", "HTML", "Tiptap", "EditorJS"),
        categoryValue: v.optional(literals(...lascategories)),
        authorAnonimousId: v.optional(v.string()),
        likeText: v.object({
            positive: v.string(),
            negative: v.string(),
        }),
        embedding: v.optional(v.array(v.float64())), // Cohere Embed 3 Model embeddings
        //fields: v.optional(v.any()),
    }).index("by_popularity", ["viewsCounter", "commentsCounter"])
        .index("by_author", ["authorId"])
        .index("by_category", ["categoryValue"])
        .index("by_slug", ["slug"])
        .vectorIndex("by_embedding", {
            vectorField: "embedding",
            dimensions: 1024,
        })
        .searchIndex("by_content", {
            searchField: "contentInMarkdown",
            filterFields: ["categoryValue"],
        })
    ,
    comment: defineTable({
        authorId: v.id("user"),
        parentId: v.optional(v.id("comment")),
        content: v.string(),
        postId: v.id("post"),
        anonimo: v.boolean(),
        asOrganization: v.optional(v.boolean()),
        organizationId: v.optional(v.id("organization")),
        authorAnonimousId: v.optional(v.string())
    }).index("withPost", ["postId"]).index("by_author", ["authorId"]),
    reaction: defineTable({
        userId: v.id("user"),
        reaction_type: literals("like", "dislike"),
        content_type: literals("post", "comment"),
        contentId: v.union(v.id("post"), v.id("comment"))
    }).index("byUser", ["userId"]).index("byContent", ["content_type"]).index("byType", ["reaction_type"]).index("byContentId", ["contentId"]),
    embeddings: defineTable({
        artifactId: v.union(v.id("post"), v.id("comment"), v.id("organization"), v.id("user"), v.id("scraped_pages")),
        embedding: v.array(v.float64()),
        artifactType: literals("post", "comment", "organization", "user", "scraped_pages"),
    }).vectorIndex("by_embedding", {
        vectorField: "embedding",
        dimensions: 1024,
        filterFields: ["artifactType"],
    }),
    scraped_pages: defineTable({
        url: v.string(),
        lastUpdated: v.number(),
        scraped_status: literals("scraped", "error", "pending"),
        content: v.optional(v.string()),
    }),
    organization: defineTable({
        name: v.string(),
        color: v.string(),
        logo: v.string(),
        url: v.string(),
        description: v.string(),
        members: v.array(v.id("user")),
    }),
    user: defineTable({
        email: v.string(),
        clerkid: v.string(),
        firebaseid: v.optional(v.string()),
        displayName: v.optional(v.string()),
        photoURL: v.optional(v.string()),
        username: v.string(),
        phoneNumber: v.optional(v.number()),
        university: v.id("university"),
        description: v.optional(v.string()),
        career: v.optional(v.string()),
        semester: v.optional(v.number()),
        name: v.optional(v.string()),
        lastname: v.optional(v.string()),
        settings: v.optional(v.object({
            anonimoDefault: v.boolean(),
            useUserName: v.boolean(),
        })),
    }).index("byFirebaseId", ["firebaseid"]).index("byClerkId", ["clerkid"])
    ,
    university: defineTable({
        name: v.string(),
        logo: v.string(),
        url: v.string(),
        domain: v.string(),
    }).index("byDomain", ["domain"]),
    category: defineTable({
        color: v.string(),
        name: v.string(),
        value: v.string(),
        description: v.string(),
    }),
    // field: defineTable(v.union(
    //     v.object({type: v.literal("text"), name: v.string(), description: v.string(), value: v.string()}),
    //     v.object({type: v.literal("number"), name: v.string(), description: v.string(), value: v.number()}),
    //     v.object({type: v.literal("checkbox"),name: v.string(), description: v.string(), value: v.boolean()}),
    //     v.object({type: v.literal("select"),name: v.string(), description: v.string(), value: v.array(v.string())})
    //     )
    // ),
})