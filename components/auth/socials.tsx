"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
export default function Socials() {
  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <Button
        className="flex gap-4 w-full"
        onClick={() =>
          signIn("google", {
            redirect: false,
            redirectTo: "/",
          })
        }
      >
        <p>Sign in with Google</p>
        <FcGoogle className="w-5 h-5" />
      </Button>
      <Button
        className="flex gap-4 w-full"
        onClick={() =>
          signIn("github", {
            redirect: false,
            redirectTo: "/",
          })
        }
      >
        <p>Sign in with Github</p>
        <FaGithub className="w-5 h-5" />
      </Button>
    </div>
  );
}
