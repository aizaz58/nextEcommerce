export const admin = require("firebase-admin");

let serviceAccount = (process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEYS);


if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminDB = admin.firestore();
