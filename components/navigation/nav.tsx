import { auth } from "@/server/auth";
import UserButton from "./user-button";
import { Button } from "../ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="py-8">
      <nav>
        <ul className=" flex justify-between items-center">
          <li className="w-50  max-w-[400px] max-h-[100px] overflow-hidden">
            <Link href="/" area-label="NextBuy logo">
              <h1 className="text-4xl font-extrabold text-primary tracking-tight">
                Next<span className="text-blue-500">Buy</span>
              </h1>
            </Link>
          </li>
          <li>
            {!session ? (
              <Button asChild>
                <Link className="flex gap-2" href="/auth/login">
                  <LogIn />
                  <span>Login</span>
                </Link>
              </Button>
            ) : (
              <UserButton expires={session?.expires} user={session?.user} />
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
