import { Button } from "@/components/ui/button";
import { admin, adminDB } from "@/lib/firebase_admin";
import Link from "next/link";

type LineItem = {
  price_data?: { unit_amount?: number };
  quantity?: number;
};

type CheckoutData = {
  id: string;
  metadata?: { uid?: string };
  line_items?: LineItem[];
};

const fetchCheckout = async (checkoutId: string): Promise<{ checkout: any; typed: CheckoutData } | null> => {
  try {
    const list = await adminDB
      .collectionGroup("checkout_sessions_cod")
      .where("id", "==", checkoutId)
      .get();

    if (list?.docs.length === 0) {
      console.error("No checkout found with ID:", checkoutId);
      return null;
    }

    const data = list.docs[0].data();
    if (!data?.id) {
      console.error("Checkout data missing ID field");
      return null;
    }

    // Extract typed data for calculations
    const typed: CheckoutData = {
      id: String(data.id),
      metadata: data.metadata ? {
        uid: data.metadata.uid ? String(data.metadata.uid) : undefined,
      } : undefined,
      line_items: Array.isArray(data.line_items) ? data.line_items.map((item: any) => ({
        price_data: item.price_data ? {
          unit_amount: item.price_data.unit_amount ? Number(item.price_data.unit_amount) : undefined,
        } : undefined,
        quantity: item.quantity ? Number(item.quantity) : undefined,
      })) : undefined,
    };

    // Return both original data (for storage) and typed data (for calculations)
    return {
      checkout: data, // Original Firestore data
      typed, // Typed extracted data
    };
  } catch (error) {
    console.error("Error fetching checkout data:", error);
    return null;
  }
};

const calculateAmount = (items: LineItem[] | undefined) =>
  items?.reduce(
    (prev, curr) =>
      prev + ((curr?.price_data?.unit_amount ?? 0) * (curr?.quantity ?? 1)),
    0
  ) ?? 0;

const processOrder = async ({ 
  checkout, 
  typed 
}: { 
  checkout: any; 
  typed: CheckoutData;
}) => {
  if (!checkout || !typed) {
    console.error("Cannot process order: checkout or typed data is null");
    return false;
  }

  try {
    const orderRef = adminDB.doc(`orders/${typed.id}`);
    const order = await orderRef.get();
    
    if (order.exists) {
      console.log("Order already exists:", typed.id);
      return false;
    }

    const uid = typed.metadata?.uid || "unknown";

    await orderRef.set({
      checkout: checkout, // Store original Firestore data
      payment: { 
        amount: calculateAmount(typed.line_items) 
      },
      uid,
      id: typed.id,
      paymentMode: "cod",
      timestampCreate: admin.firestore.Timestamp.now(),
    });

    return true;
  } catch (error) {
    console.error("Error processing order:", error);
    return false;
  }
};

export default async function Page({
  searchParams,
}: {
  searchParams: { checkout_id?: string };
}) {
  const { checkout_id } = searchParams;

  if (!checkout_id) {
    return <h1 className="text-red-500">Invalid Checkout ID</h1>;
  }

  try {
    const checkoutData = await fetchCheckout(checkout_id);

    if (!checkoutData) {
      return <h1 className="text-red-500">Checkout Not Found</h1>;
    }

    await processOrder({ checkout: checkoutData.checkout, typed: checkoutData.typed });

    return (
      <main>
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
            <Button>Go To Orders Page</Button>
          </Link>
        </div>
      </section>
      </main>
    );
  } catch (error) {
    console.error("Page error:", error);
    return (
      <main>
        <section className="min-h-screen flex flex-col gap-3 justify-center items-center">
          <h1 className="text-red-500">An error occurred while processing your order</h1>
          <p className="text-gray-600">Please try again or contact support.</p>
        </section>
      </main>
    );
  }
}
