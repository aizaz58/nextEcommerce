"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { createUser } from "@/lib/firestore/user/write";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
};

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      router.replace("/account");
    }
  }, [user, router]);

  const handleData = (key: keyof SignUpFormData, value: string) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSignUp = async () => {
    if (!data.name || !data.email || !data.password) {
      toast.error("Please complete all fields");
      return;
    }

    setIsLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await updateProfile(credential.user, {
        displayName: data.name,
      });
      const firebaseUser = credential.user;
      await createUser({
        uid: firebaseUser?.uid,
        displayName: data.name,
        photoURL: firebaseUser?.photoURL,
      });
      toast.success("Successfully signed up");
      router.push("/account");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full flex justify-center items-center px-4 py-10 md:p-24 ">
      <section className="flex flex-col gap-6 w-full max-w-lg">
        <div className="flex items-center justify-center">
          <Link
            href="/"
            className="flex justify-center items-center flex-start md:ml-2 ml-0"
          >
            <Image src="/svgs/logo.svg" alt="Aheadmart logo" height={48} width={48} priority />
            <span className="font-bold text-2xl ml-3">AHEADMART</span>
          </Link>
        </div>
        <div className="flex flex-col gap-3 md:p-10 p-5 rounded-xl w-full border bg-background shadow-sm">
          <h1 className="text-center font-bold text-xl">Sign Up With Email</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUp();
            }}
            className="flex flex-col gap-3"
          >
            <input
              placeholder="Enter Your Name"
              type="text"
              name="user-name"
              id="user-name"
              value={data.name}
              onChange={(e) => {
                handleData("name", e.target.value);
              }}
              className="px-3 py-2 rounded-xl border focus:outline-none w-full"
              required
            />
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
            <input
              placeholder="Enter Your Password"
              type="password"
              name="user-password"
              id="user-password"
              value={data.password}
              onChange={(e) => {
                handleData("password", e.target.value);
              }}
              className="px-3 py-2 rounded-xl border focus:outline-none w-full"
              required
            />
            <Button isLoading={isLoading} isDisabled={isLoading} type="submit">
              {isLoading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
          <div className="flex justify-between flex-wrap gap-3">
            <Link href="/login" className="flex-1">
              <Button
                variant="ghost"
                className="font-semibold text-sm text-primary w-full"
              >
                Already user? Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
