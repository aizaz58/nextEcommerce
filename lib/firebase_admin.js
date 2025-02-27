export const admin = require("firebase-admin");
const serviceAccountKey = Buffer.from(
  process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEYS || "",
  "base64"
).toString("utf8");

const serviceAccount = JSON.parse(serviceAccountKey);

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminDB = admin.firestore();
