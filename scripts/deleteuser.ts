import { clerkClient } from "@clerk/nextjs/server";

const clerkusers = await clerkClient.users.getUserList({limit: 500});

for (let user of clerkusers.data) {
    clerkClient.users.deleteUser(user.id);
}