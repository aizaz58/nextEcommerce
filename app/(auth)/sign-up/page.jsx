"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { createUser } from "@/lib/firestore/user/write";
;
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
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
  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        data?.email,
        data?.password
      );
      await updateProfile(credential.user, {
        displayName: data?.name,
      });
      const user = credential.user;
      await createUser({
        uid: user?.uid,
        displayName: data?.name,
        photoURL: user?.photoURL,
      });
      toast.success("Successfully Sign Up");
      router.push("/account");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <main className="w-full flex justify-center items-center  md:p-24  min-h-screen">
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-center">
        <Link href={"/"} className='flex justify-center items-center flex-start md:ml-2 ml-4'>

<Image
             src='/svgs/logo.svg'
             alt={`logo`}
             height={48}
             width={48}
             priority={true}
           />
            <span className=' font-bold text-2xl ml-3'>
             AHEADMART
           </span>
     </Link>
  
        </div>
        <div className="flex flex-col gap-3  md:p-10 p-5 rounded-xl w-full md:min-w-[440px]">
          <h1 className=" text-center font-bold text-xl">Sign Up With Email</h1>
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
              value={data?.name}
              onChange={(e) => {
                handleData("name", e.target.value);
              }}
              className="px-3 py-2 rounded-xl border focus:outline-none w-full"
            />
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
              Sign Up
            </Button>
          </form>
          <div className="flex justify-between">
            <Link href={`/login`}>
              <Button variant={"ghost"} className="font-semibold text-sm text-primary">
                Already user? Sign In
              </Button>
            </Link>
            
          </div>
        </div>
      </section>
    </main>
  );
}
