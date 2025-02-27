"use client";

import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { createUser } from "@/lib/firestore/user/write";
import { Button } from "@/components/ui/button";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({});

  const handleData = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data?.email, data?.password);
      toast.success("Logged In Successfully");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      router.push("/account");
    }
  }, [user]);

  return (
    
    <main className=" w-full flex justify-center items-center  md:p-24  min-h-screen">
      <section className="flex flex-col gap-3 ">
        <div className="flex items-center justify-center">
          
           <Image height={48} width={48}  src="/svgs/logo.svg" alt="Logo" />
           <span className=' font-bold text-2xl ml-3'>
              AHEADMART
            </span> 
        </div>
        <div className="flex flex-col gap-3  md:p-10 p-5 rounded-xl w-full md:min-w-[440px] ">
          <h1 className=" text-center w-auto font-bold text-xl">Login With Email</h1>
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
              value={data?.email}
              onChange={(e) => {
                handleData("email", e.target.value);
              }}
              className="px-3 py-2 rounded-xl border focus:outline-none w-full"
            />
            <input
              placeholder="Enter Your Password"
              type="password"
              name="user-password"
              id="user-password"
              value={data?.password}
              onChange={(e) => {
                handleData("password", e.target.value);
              }}
              className="px-3 py-2 rounded-xl border focus:outline-none w-full"
            />
            
            <Button
            
              isLoading={isLoading}
              isDisabled={isLoading}
              type="submit"
              color="primary"
            >
             {isLoading?"Loging In": "Login"}
            </Button>
          </form>
          <div className="flex gap-2 justify-between">
            <Link href={`/sign-up`}>
              <Button variant={"secondary"} className=" font-semibold text-sm text-primary">
                New? Create Account
              </Button>
            </Link>
            <Link href={`/forget-password`}>
              <Button variant={"secondary"} className=" font-semibold text-sm text-primary">
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
  const [isLoading, setIsLoading] = useState(false);
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
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };
  return (
    <Button isLoading={isLoading} isDisabled={isLoading} onClick={handleLogin}>
      Sign In With Google
    </Button>
  );
}
