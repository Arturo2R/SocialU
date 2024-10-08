import { internalMutation, mutation, query, QueryCtx } from "./_generated/server";
// import { WithoutSystemFields } from "convex/server";
import { UserJSON } from "@clerk/backend";
import { v, Validator } from "convex/values";
import schema from "./schema";

// import { Doc } from "./_generated/dataModel";

export const current = query({
  handler: async (ctx) => {
    return await getCurrentUser(ctx)
    // let userorganizationmemeber

    // const org = await ctx.db.query("organization").collect();
    // if(user && org){ 
    //   userorganizationmemeber = org.find((o) => o.members.includes(user._id))
    // }

    // if (userorganizationmemeber) {
    //   return {...user, isMember: true, organization: org }
    // }

    // return {...user, isMember: false};
  },
});



export const getSafeUser = query({
  args: { userId: v.id("user") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const { clerkid, _creationTime, firebaseid, settings, ...usert } = user;
    return usert
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const em = data.email_addresses[0].email_address.split("@");
    const username = em[0];
    const domain = em[1]

    const uni = await ctx.db.query("university").withIndex("byDomain", (q) => q.eq("domain", domain)).unique();

    if (!uni) {
      throw new Error("Invalid email domain, algo pasa con ")
    }

    const userAttributes = {
      email: data.email_addresses[0].email_address,
      clerkid: data.id,
      displayName: `${data.first_name} ${data.last_name}`,
      username: username,
      university: uni._id,
      name: data.first_name || undefined,
      lastname: data.last_name || undefined,
      settings: {
        anonimoDefault: false,
        useUserName: true,
      },
      ...(data.external_id && { firebaseid: data.external_id })
    };

    const user = await userByClerkId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert("user", userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});


export const update = mutation({
  args: {
    data: v.object({
      anonimoDefault: v.boolean(),
      useUserName: v.boolean(),
      phoneNumber: v.optional(v.number()),
      description: v.optional(v.string()),
      career: v.optional(v.string()),
      semester: v.optional(v.number())
    })
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const { anonimoDefault, useUserName, ...rest } = args.data;
    let payload = {
      ...rest,
      settings: {
        anonimoDefault: anonimoDefault,
        useUserName: useUserName,
      }
    };

    await ctx.db.patch(user._id, payload);
  },
});

export const slugs = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("user").collect();
    const organizations = await ctx.db.query("organization").collect();
    return users.map((user) => user.username).concat(organizations.map((org) => org.name))
  }
})

export const getUserByUserName = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.query("user").filter((q) => q.eq(q.field("username"), args.slug)).first();
    if (!user) {
      const org = await ctx.db.query("organization").filter((q) => q.eq(q.field("name"), args.slug)).first();
      if (!org) {
        throw new Error("User not found");
      }
      return { ...org, type: "organization" }
    }
    const { clerkid, _creationTime, firebaseid, settings, ...usert } = user;
    return { ...usert, type: "user" }
  }
})





export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByClerkId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
      );
    }
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByClerkId(ctx, identity.subject);
}

async function userByClerkId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("user")
    .withIndex("byClerkId", (q) => q.eq("clerkid", externalId))
    .unique();
}

