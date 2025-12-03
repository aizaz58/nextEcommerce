import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
  startAfter,
  limit,
} from "firebase/firestore";
import { Product } from "@/lib/types/types";
import { serializeFirestoreData } from "@/lib/utils/serializeFirestore";

export const getProduct = async ({ id }:{id:string}) => {
  const data = await getDoc(doc(db, `products/${id}`));
  if (data.exists()) {
    return serializeFirestoreData(data.data());
  } else {
    return null;
  }
};

export const getFeaturedProducts = async () => {
  const list = await getDocs(
    query(collection(db, "products"), where("isFeatured", "==", true))
  );
  return list.docs.map((snap) => serializeFirestoreData(snap.data())) as Product[];
};

export const getProducts = async () => {
  const productsRef = collection(db, "products");
  const q = query(productsRef, orderBy("timestampCreate", "desc"));
  const list = await getDocs(q);
  
  // getDocs fetches all documents (up to Firestore's limit per query)
  // If you have more than ~1MB of data, you may need pagination
  // For most use cases, this will fetch all products
  const allProducts = list.docs.map((snap) => serializeFirestoreData(snap.data())) as Product[];
  
  // If there are more documents, getDocs will fetch them automatically
  // But if you have a very large dataset, you might need to implement pagination
  return allProducts;
};

export const getProductsByCategory = async ({ categoryId, excludeId }:{categoryId:string, excludeId:string}) => {
  const list = await getDocs(
    query(
      collection(db, "products"),
      orderBy("timestampCreate", "desc"),
      where("categoryId", "==", categoryId)
    )
  );
  
  // Filter out the product that matches excludeId
  return list.docs
    .map((snap) => serializeFirestoreData(snap.data()))
    .filter((product) => product.id !== excludeId);
};
