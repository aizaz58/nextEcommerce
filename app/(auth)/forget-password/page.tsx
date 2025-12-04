"use client";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<{ email: string }>({ email: "" });

  const handleData = (key: "email", value: string) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSendEmail = async () => {
    if (!data.email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast.success("Reset link has been sent to your email!");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full flex justify-center items-center px-4 py-10 md:p-24 min-h-screen">
      <section className="flex flex-col gap-6 w-full max-w-lg">
        <div className="flex justify-center">
          <Link
            href="/"
            className="flex justify-center items-center flex-start md:ml-2 ml-0"
          >
            <Image
              src="/svgs/logo.svg"
              alt="Aheadmart logo"
              height={48}
              width={48}
              priority
            />
            <span className="font-bold text-2xl ml-3">AHEADMART</span>
          </Link>
        </div>
        <div className="flex flex-col gap-3 md:p-10 p-5 rounded-xl w-full border bg-background shadow-sm">
          <h1 className="font-bold text-xl text-center">Forgot Password</h1>
          <p className="text-sm text-muted-foreground text-center">
            Enter the email associated with your account and we will send you a
            link to reset your password.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendEmail();
            }}
            className="flex flex-col gap-3"
          >
            <input
              placeholder="Enter Your Email"
              type="email"
              name="user-email"
              id="user-email"
              value={data.email}
              onChange={(e) => {
                handleData("email", e.target.value);
              }}
              className="px-3 py-2 rounded-xl border focus:outline-none w-full"
              required
            />

            <Button
              isLoading={isLoading}
              isDisabled={isLoading}
              type="submit"
              className="w-full"
            >
              Send Reset Link
            </Button>
          </form>
          <div className="flex justify-between flex-wrap gap-3">
            <Link href="/login" className="flex-1">
              <Button
                variant="secondary"
                className="font-semibold text-sm w-full"
              >
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
