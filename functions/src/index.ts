import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// The Firebase Admin SDK to access the Firebase Realtime Database. 
admin.initializeApp(functions.config().firebase);


// export const createNewUserInFirestore = functions.auth
//   .user()
//   .onCreate((user) => {
//     functions.firestore.namespace;
//   });

export const securedPosts = functions.firestore
  .document('posts/{docId}')
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const doc = snap.data();
    let Payload = {}
    // access a particular field as you would any JS property
    if(doc.anonimo){
      Payload = {
        ...doc,
        authorEmail: "",
        authorImage: "",
        authorName: "",
        authorRef: "",
        userName: "",
        userUID: "",
      }
    }

    admin.firestore().doc(`/publicPosts/${snap.id}`).create(Payload)
    // perform desired operations ...
  });
