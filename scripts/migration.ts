import admin from 'firebase-admin';
import { Doc } from '../app/convex/_generated/dataModel';
import { clerkClient } from '@clerk/nextjs/server';

let serviceAccount = require("./src/socialu-c62e6-firebase-adminsdk-taev9-0f08a59956.json");
const fs = require('fs');


// Initialize the Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://socialu-c62e6-default-rtdb.firebaseio.com"
    });
}

const firestore = admin.firestore();

const exportFirestoreCollection = async (collectionName: string) => {
    const clerkusers = await clerkClient.users.getUserList();
    const emails = clerkusers.data.map(c=>c.emailAddresses)
    console.log(emails)

    try {
        const collectionToFectch = firestore.collection(collectionName);
        const querySnapshot = await collectionToFectch.get();
        let counter = 1;
        const documents = querySnapshot.docs.map((doc) => {
            
            const data = doc.data()
            console.log(counter, " migrated", data.displayName || "sin titulo");

            const clerkuser = clerkusers.data.find(cl => cl.primaryEmailAddress === data.email)

            const user = {
                ...(clerkuser?.id && {clerkid: clerkuser.id}),
                university: "kn7eb4j6bp2eh8epre894krbxx6vj776",
                email: data.email,
                displayName: data.displayName,
                firebaseid: data.uid,
                username: data.userName,
                settings: {
                    anonimoDefault: data.anonimoDefault || false,
                    useUserName: data.useUserName || true,
                },
                ...(data.career && {career: data.career}),
                ...(data.semester && {semester: data.semester}),
            } as Doc<"user">



            counter++;
            return user;
            // let { createdAt, ...rest} = doc.data();
            // if (createdAt?.hasOwnProperty('_seconds') && createdAt._seconds === 1713804111) {
            //     return;
            // }
            // if(rest.date)
            //     rest.date = rest.date._seconds;
            // if(rest.computedDate)
            //     rest.computedDate = rest.computedDate._seconds;
            // if (createdAt) {
            //     let unixTimestampMillis = (createdAt._seconds * 1000) + (createdAt._nanoseconds / 1000000);
            //     return {...rest, _creationTime: unixTimestampMillis};
            // } else {
            //     return rest;
            // }
        });
    
        // Write documents to a JSON file
        // Write documents to a JSONL file
        fs.writeFileSync(`${collectionName}.jsonl`, documents.map(doc => JSON.stringify(doc)).join('\n'));

        console.log(`Documents exported to ${collectionName}.jsonl`);
        fs.writeFileSync(`${collectionName}.json`, JSON.stringify(documents));
    
        console.log(`Documents exported to ${collectionName}.json`);
        
    } catch (error) {
        console.error("Failed to export collection:", error);
    }
}

    
(async () => {
    await exportFirestoreCollection('user');
})();