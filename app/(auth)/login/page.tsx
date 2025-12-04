"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { createUser } from "@/lib/firestore/user/write";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type LoginFormData = {
  email: string;
  password: string;
};

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<LoginFormData>({ email: "", password: "" });

  useEffect(() => {
    if (!user) return;
    // Decide where to send the user after they're already logged in:
    // - If there is a ?redirect=/some/path param, go there
    // - Otherwise, go home
    const redirectParam = searchParams.get("redirect");
    const target = redirectParam && redirectParam.trim() !== "" ? redirectParam : "/";
    router.replace(target);
  }, [user, router, searchParams]);

  const handleData = (key: keyof LoginFormData, value: string) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLogin = async () => {
    if (!data.email || !data.password) {
      toast.error("Please enter your email and password");
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success("Logged in successfully");
      // If login page was opened with ?redirect=..., go there; otherwise home
      const redirectParam = searchParams.get("redirect");
      const target = redirectParam && redirectParam.trim() !== "" ? redirectParam : "/";
      router.push(target);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full flex justify-center items-center py-10 md:p-24 ">
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-center">
          <Image height={48} width={48} src="/svgs/logo.svg" alt="Logo" />
          <span className="font-bold text-2xl ml-3">AHEADMART</span>
        </div>
        <div className="flex flex-col gap-3 md:p-10 p-5 rounded-xl w-full md:min-w-[440px]">
          <h1 className="text-center w-auto font-bold text-xl">Login With Email</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
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
              {isLoading ? "Logging In..." : "Login"}
            </Button>
          </form>
          <div className="flex gap-2 justify-between">
            <Link href="/sign-up">
              <Button variant="secondary" className="font-semibold text-sm text-primary">
                New? Create Account
              </Button>
            </Link>
            <Link href="/forget-password">
              <Button variant="secondary" className="font-semibold text-sm text-primary">
                Forget Password?
              </Button>
            </Link>
          </div>
          <hr />
          <SignInWithGoogleComponent />
        </div>
      </section>
    </main>
  );
}

function SignInWithGoogleComponent() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = credential.user;
      await createUser({
        uid: user?.uid,
        displayName: user?.displayName,
        photoURL: user?.photoURL,
      });
      toast.success("Logged in successfully");
      // Respect ?redirect=... when present, otherwise go home
      const redirectParam = searchParams.get("redirect");
      const target = redirectParam && redirectParam.trim() !== "" ? redirectParam : "/";
      router.push(target);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to log in with Google"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button isLoading={isLoading} isDisabled={isLoading} onClick={handleLogin}>
      Sign In With Google
    </Button>
  );
}
