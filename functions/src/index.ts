import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

interface universities {
  name: string;
  domain: string;
}

const allowedUniversities: universities[] = [
  { name: "Universidad Del Norte", domain: "uninorte.edu.co" },
];

const emailDomainRegex = /([a-z]*)@([a-z]*.[a-z]*.[a-z]*)/gm;

export const isAUniversityStudent = functions.auth.user().onCreate((user) => {
  const emailDomain: string[] = emailDomainRegex.exec(user.email) || [
    "lalama.com",
    "lalalama.com",
    "lalama.com",
  ];

  console.log("=========");

  console.log(emailDomain);

  let allowed = allowedUniversities.some((item) => {
    return item.domain === emailDomain[2];
  });

  allowed
    ? console.log("Permitido el caremonda de " + user.displayName)
    : console.log("Jodete");

  functions.
});
