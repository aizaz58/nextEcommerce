import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { serializeFirestoreData } from "@/lib/utils/serializeFirestore";

export const getCategory = async ({ id }) => {
  const data = await getDoc(doc(db, `categories/${id}`));
  if (data.exists()) {
    return serializeFirestoreData(data.data());
  } else {
    return null;
  }
};

export const getCategories = async () => {
  const list = await getDocs(collection(db, "categories"));
  return list.docs.map((snap) => serializeFirestoreData(snap.data()));
};
