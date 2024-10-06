import { v } from "convex/values";
import { internalMutation, mutation, internalAction } from "./_generated/server";
import { literals } from "convex-helpers/validators";
import { getCurrentUserOrThrow } from "./user";
import { Id } from "./_generated/dataModel";

import { action } from "./_generated/server";
import { api, internal } from "./_generated/api";

export const give = mutation({
    args: {
        postId: v.union(v.id("post"), v.id("comment")),
        reaction_type: literals("like", "dislike"),
        content_type: literals("post", "comment"),
    },
    async handler(ctx, args) {
        const user = await getCurrentUserOrThrow(ctx);
        const { postId, reaction_type } = args;
        if (user === null) {
            throw new Error("User not found");
        }
        const existsReaction = await ctx.db.query("reaction")
            .withIndex("byUser", (q) =>
                q.eq("userId", user._id)
            )
            .filter((q) => q.eq(q.field("contentId"), args.postId))
            .unique();

        if (existsReaction) {
            if (existsReaction.reaction_type === reaction_type) {
                await ctx.db.delete(existsReaction._id);
            } else {
                await ctx.db.patch(existsReaction._id, { reaction_type: args.reaction_type });
            }
        } else {
            await ctx.db.insert("reaction", {
                userId: user._id,
                contentId: postId,
                reaction_type: args.reaction_type,
                content_type: args.content_type,
            });
        }
    }
})

import OpenAI from "openai";
import { isArgumentsObject } from "util/types";



export const generate = internalAction({
    args: {
        content: v.string(),
        title: v.string(),
        postId: v.optional(v.id("post")),
    },
    handler: async (ctx, args) => {
        // implementation goes here
        const key = "sk-LWw35QVpsorVhGcsLwUC-pyaNDA8Vyt5-pvGbLMZiuT3BlbkFJl1Q7bSGoh3u090C45AliML70IRYHI9QkBcelwcKegA" // process.env.OPENAI_API_KEY
        const openai = new OpenAI({ apiKey: key, });

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "text",
                            "text": "Soy SocialU y junto a Arturo, somos los hosts de esta comunidad universitaria. Quiero que leas el siguiente contenido desde la perspectiva de un usuario que lo está leyendo, no de quien lo escribe. Basándote en el tono y contexto del post, genera un set binario de reacciones, donde las dos opciones sean opuestas, abstractas, y no demasiado especificas, y reflejar una posición a favor o en contra del autor del contenido. Asegúrate de que el lenguaje sea natural, cercano y coloquial, como si estuvieras hablando con un amigo. Los ejemplos que te doy son: ('Me parece bien', 'No me parece bien'), ('Lo haría', 'No lo haría'), ('Lo apoyo', 'No lo apoyo') pero puedes tener más creatividad. Las respuestas deben reflejar si el lector está a favor o en contra, no sin ser demasiado específicas, deben ser simples y breves(no más de 5 palabras) pero no vagas. Devuelve solo un set binario en formato JSON, con una opción positiva y una negativa, que sean claramente opuestas y balanceadas. Usa lenguaje de juvenil sin ser evidente, especialmente jóvenes de la costa colombiana. Si el contenido no da para un set lógico, simplemente devuelve el de me gusta y no me gusta."
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": args.content
                        }
                    ]
                }
            ],
            temperature: 1,
            max_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            response_format: {
                "type": "json_schema",
                "json_schema": {
                    "name": "positive_negative_schema",
                    "strict": true,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "positive": {
                                "type": "string",
                                "description": "A string that represents a positive reactuon."
                            },
                            "negative": {
                                "type": "string",
                                "description": "A string that represents a negative negative."
                            }
                        },
                        "required": [
                            "positive",
                            "negative"
                        ],
                        "additionalProperties": false
                    }
                }
            },
        });

        const likestext = JSON.parse(response.choices[0].message.content as string)

        if (args.postId) {
            await ctx.runMutation(internal.reaction.updateReactionText, { postId: args.postId, text: likestext });
        }
        // optionally return a value
        return likestext;
    },
});

export const updateReactionText = internalMutation({
    args: {
        text: v.object({
            positive: v.string(),
            negative: v.string(),
        }),
        postId: v.id("post"),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.postId, { likeText: args.text });
    }
})