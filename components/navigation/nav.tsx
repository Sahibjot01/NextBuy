import { auth } from "@/server/auth";
import UserButton from "./user-button";
import { Button } from "../ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";
import CartDrawer from "../cart/cart-drawer";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="py-8">
      <nav>
        <ul className=" flex justify-between items-center md:gap-8 gap-4 ">
          <li className="flex flex-1  overflow-hidden">
            <Link href="/" area-label="NextBuy logo">
              <h1 className="text-4xl font-extrabold text-primary tracking-tight">
                Next<span className="text-blue-500">Buy</span>
              </h1>
            </Link>
          </li>
          <li className="relative flex items-center hover:bg-muted">
            <CartDrawer />
          </li>
          <li className=" flex items-center justify-center">
            {!session ? (
              <Button asChild className="cursor-pointer">
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
