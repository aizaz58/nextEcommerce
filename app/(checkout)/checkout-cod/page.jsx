import Footer from "@/app/components/Footer"
import Header from "@/app/components/Header"
import { Button } from "@/components/ui/button";
import { admin, adminDB } from "@/lib/firebase_admin"
import Link from "next/link";

// const fetchCheckout = async (checkoutId) => {
//   const list = await adminDB
//     .collectionGroup("checkout_sessions_cod")
//     .where("id", "==", checkoutId)
//     .get();
//   if (list.docs.length === 0) {
//     throw new Error("Invalid Checkout ID");
//   }
//   return list?.docs[0]?.data();
// };
const safeParseJSON = (data) => {
  try {
    return JSON.parse(JSON.stringify(data)); // Ensures valid JSON
  } catch (error) {
    console.error("JSON Parsing Error:", error);
    return null;
  }
};

const fetchCheckout = async (checkoutId) => {
  try {
    debugger
    console.log(checkoutId)
    console.log("first",adminDB)
    const list = await adminDB
      .collectionGroup("checkout_sessions_cod")
      .where("id", "==", checkoutId)
      .get();
console.log("list",list)
    if (list?.docs.length === 0) {
      console.error("Invalid Checkout ID:", checkoutId);
      return null; // Instead of throwing an error, return null
    }

    const data = list.docs[0].data();
    
    
    return data;
  } catch (error) {
    console.error("Error fetching checkout data:", error);
    return null;
  }
};

const processOrder = async ({ checkout }) => {
  if (!checkout) {
    console.error("Invalid checkout data:", checkout);
    return false;
  }

  try {
    const order = await adminDB.doc(`orders/${checkout.id}`).get();
    if (order.exists) return false;

    const uid = checkout?.metadata?.uid || "unknown";

    await adminDB.doc(`orders/${checkout.id}`).set({
      checkout,
      payment: {
        amount: checkout?.line_items?.reduce(
          (prev, curr) => prev + (curr?.price_data?.unit_amount || 0) * (curr?.quantity || 1),
          0
        ),
      },
      uid,
      id: checkout.id,
      paymentMode: "cod",
      timestampCreate: admin.firestore.Timestamp.now(),
    });

    return true;
  } catch (error) {
    console.error("Error processing order:", error);
    return false;
  }
};



export default async function Page({ searchParams }) {
  debugger
  const { checkout_id } = searchParams;
  
  if (!checkout_id) {
    return <h1 className="text-red-500">Invalid Checkout ID</h1>;
  }
  const checkout = (await fetchCheckout(checkout_id));
console.log(checkout)

  if (!checkout) {
    return <h1 className="text-red-500">Checkout Not Found</h1>;
  }
  const result = await processOrder({ checkout });

  return (
    <main>
      <Header />
      <section className="min-h-screen flex flex-col gap-3 justify-center items-center">
        <div className="flex justify-center w-full">
          <img src="/svgs/Mobile payments-rafiki.svg" className="h-48" alt="" />
        </div>
        <h1 className="text-2xl font-semibold text-green">
          Your Order Is {" "}
          <span className="font-bold text-green-600">Successfully</span> Placed
        </h1>
        <div className="flex items-center gap-4 text-sm">
          <Link href={"/account"}>
          <Button>
              Go To Orders Page
          </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
