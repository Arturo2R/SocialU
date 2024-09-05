import admin from 'firebase-admin';
import { Doc } from '../app/convex/_generated/dataModel';
// import { clerkClient } from '@clerk/nextjs/server';

let serviceAccount = require("/home/arturo2r/Profesional2/SocialU/app/src/lib/socialu-c62e6-firebase-adminsdk-taev9-0f08a59956.json");
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
    // const clerkusers = await clerkClient.users.getUserList();
    // const emails = clerkusers.data.map(c => c.emailAddresses)
    // console.log(emails)

    try {
        const collectionToFectch = firestore.collection(collectionName);
        const querySnapshot = await collectionToFectch.get();
        let counter = 1;
        const documents = querySnapshot.docs.map((doc) => {

            const data = doc.data()
            console.log(counter, " migrated", data.title || "sin titulo");

            // const clerkuser = clerkusers.data.find(cl => cl.primaryEmailAddress === data.email)

            let post = {
                slug: doc.id,
                _creationTime: data?.createdAt?._seconds,
                title: data?.title,
                content: data?.message,
                image: data?.image,
                categoryValue: data?.tags ? data.tags[0] : "",
                asBussiness: data?.asBussiness || false,
                isOld: true,
                authorId: "ks721mahtxh1gqwph1vakkk7ss6vm9ae",
                messageFormat: data?.messageFormat === "html" ? "HTML" : (data?.messageFormat || "Markdown"),
                renderMethod: data?.renderMethod || "none",
                anonimo: data?.anonimo,
                commentsCounter: data?.commentsCounte || 0,
                viewsCounter: data?.viewsCounter || 0,
                imageData: data?.imageData,
            } as Doc<"post">

            const temp = {
                name: data.userName,
                email: data.authorEmail,
                displayName: data.authorName,
                ref: data.authorRef,
            }
            if (data.anonimo) { post = { ...post, tempUser_deprecated: temp } }

            const tempBussiness = {
                description: data.bussiness?.bussinessDescription,
                name: data?.bussiness?.bussinessName,
                email: data?.bussiness?.bussinessEmail,
                logo: data?.bussiness?.bussinessLogo,
                color: data?.bussiness?.bussinessColor,
                url: data?.bussiness?.bussinessUrl,
            }

            if (data.asBussiness) { post = { ...post, tempBussines_deprecated: tempBussiness } }

            if (data.commentsCounter > 0) {
                let commentse = []
                if (data.comentarios) {
                    let oneCounter = 0

                    const laFunctionAgregadoraDeComentarios = (object) => {
                        Object.keys(object).forEach((key) => {
                            let includesSubcomments = Object.keys(object[key]).includes("subComments")   

                            if (includesSubcomments) {
                                const { subComments, ...commentsse } = object[key]
                                commentse.push(commentsse)
                                laFunctionAgregadoraDeComentarios(object[key].subComments)
                            }
                            else {
                                commentse.push(object[key])
                            }
                        }
                    )}

                    laFunctionAgregadoraDeComentarios(data.comentarios)
                    
                }
                if (data.commentsCounter !== commentse.length) {

                    const fetchingData = async (id) => {
                        const collectionToFetch = firestore.collection(collectionName).doc(id).collection("comments");
                        const querySnapshot = await collectionToFectch.get();

                        querySnapshot.docs.map((doc) => {
                            let commentdata = doc.data()
                            commentse.push({
                                slug: doc.id,
                                _creationTime: commentdata?.createdAt?._seconds,
                                content: commentdata?.message,
                                authorId: "ks721mahtxh1gqwph1vakkk7ss6vm9ae",
                                messageFormat: commentdata?.messageFormat === "html" ? "HTML" : (commentdata?.messageFormat || "Markdown"),
                                renderMethod: commentdata?.renderMethod || "none",
                                anonimo: commentdata?.anonimo,
                                commentsCounter: commentdata?.commentsCounte || 0,
                                viewsCounter: commentdata?.viewsCounter || 0,
                                imageData: commentdata?.imageData,
                            })
                        })
                    }

                    fetchingData(doc.id)
                    
                }
                post = { ...post, comments: commentse }
                
            }

            counter++;
            return post;
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
    await exportFirestoreCollection('publicPosts');
})();