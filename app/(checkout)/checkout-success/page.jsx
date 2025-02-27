import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { admin, adminDB } from "@/lib/firebase_admin";
import Link from "next/link";
import SuccessMessage from "./components/SuccessMessage";

const fetchCheckout = async (checkoutId) => {
  try {
    const list = await adminDB
      .collectionGroup("checkout_sessions_cod")
      .where("id", "==", checkoutId)
      .get();

    if (list.docs.length === 0) {
      console.error("Invalid Checkout ID:", checkoutId);
      return null; // Instead of throwing an error, return null
    }

    const data = list.docs[0].data();
    console.log("Fetched Checkout Data:", data);
    
    return data;
  } catch (error) {
    console.error("Error fetching checkout data:", error);
    return null;
  }
};

const fetchPayment = async (checkoutId) => {
  try {
    const list = await adminDB
      .collectionGroup("payments")
      .where("metadata.checkoutId", "==", checkoutId)
      .where("status", "==", "succeeded")
      .get();

    if (list.docs.length === 0) {
      console.error("No payment found for checkout ID:", checkoutId);
      return null;
    }

    return list.docs[0].data();
  } catch (error) {
    console.error("Error fetching payment data:", error);
    return null;
  }
};


const processOrder = async ({ payment, checkout }) => {
  const order = await adminDB.doc(`orders/${payment?.id}`).get();
  if (order.exists) {
    return false;
  }
  const uid = payment?.metadata?.uid;

  await adminDB.doc(`orders/${payment?.id}`).set({
    checkout: checkout,
    payment: payment,
    uid: uid,
    id: payment?.id,
    paymentMode: "prepaid",
    timestampCreate: admin.firestore.Timestamp.now(),
  });

  const productList = checkout?.line_items?.map((item) => {
    return {
      productId: item?.price_data?.product_data?.metadata?.productId,
      quantity: item?.quantity,
    };
  });

  const user = await adminDB.doc(`users/${uid}`).get();

  const productIdsList = productList?.map((item) => item?.productId);

  const newCartList = (user?.data()?.carts ?? []).filter(
    (cartItem) => !productIdsList.includes(cartItem?.id)
  );

  await adminDB.doc(`users/${uid}`).set(
    {
      carts: newCartList,
    },
    { merge: true }
  );

  const batch = adminDB.batch();

  productList?.forEach((item) => {
    batch.update(adminDB.doc(`products/${item?.productId}`), {
      orders: admin.firestore.FieldValue.increment(item?.quantity),
    });
  });

  await batch.commit();
  return true;
};

export default async function Page({ searchParams }) {
  debugger
  const { checkout_id } = searchParams;
  const checkout = await fetchCheckout(checkout_id);
  const payment = await fetchPayment(checkout_id);

  const result = await processOrder({ checkout, payment });

  return (
    <main>
      <Header />
      <SuccessMessage />
      <section className="min-h-screen flex flex-col gap-3 justify-center items-center">
        <div className="flex justify-center w-full">
          <img src="/svgs/Mobile payments-rafiki.svg" className="h-48" alt="" />
        </div>
        <h1 className="text-2xl font-semibold text-green">
          Your Order Is{" "}
          <span className="font-bold text-green-600">Successfully</span> Placed
        </h1>
        <div className="flex items-center gap-4 text-sm">
          <Link href={"/account"}>
            <button className="text-blue-600 border border-blue-600 px-5 py-2 rounded-lg bg-white">
              Go To Orders Page
            </button>
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
