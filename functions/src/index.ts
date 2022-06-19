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
    .document("posts/{docId}")
    .onCreate((snap) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
      const doc = snap.data();
      let Payload = doc;
      // access a particular field as you would any JS property
      if (doc.anonimo) {
        Payload = {
          ...doc,
          authorEmail: "",
          authorImage: "",
          authorName: "",
          authorRef: "",
          userName: "",
          userUID: "",
        };
      }
      console.log("Documento", snap.id);

      admin.firestore().doc(`/publicPosts/${snap.id}`).create(Payload);
    // perform desired operations ...
    });

export const securedComments = functions.firestore
    .document("posts/{docId}/comments/{commentId}")
    .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
      const comment = snap.data();
      let Payload = comment;
      // access a particular field as you would any JS property
      if (comment.anonimo) {
        Payload = {
          ...comment,
          author: "anonimo",
        };
      }
      console.log("Documento", snap.id);

      admin
          .firestore()
          .doc(
              `/publicPosts/${context.params.docId}/comments/${context.params.commentId}`
          )
          .create(Payload);
    // perform desired operations ...
    });
