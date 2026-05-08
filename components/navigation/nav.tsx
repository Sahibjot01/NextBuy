import { auth } from "@/server/auth";
import UserButton from "./user-button";
import { Button } from "../ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";
import CartDrawer from "../cart/cart-drawer";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 -mx-6 mb-8 border-b border-border/60 bg-background/70 px-6 py-4 backdrop-blur-xl md:-mx-12 md:px-12">
      <nav>
        <ul className="flex items-center gap-4">
          <li className="flex flex-1 overflow-hidden">
            <Link href="/" aria-label="NextBuy logo" className="group inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-black text-primary-foreground shadow-lg shadow-primary/25 transition group-hover:-rotate-6">
                NB
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight md:text-3xl">
                  Next<span className="text-primary">Buy</span>
                </h1>
                <p className="hidden text-xs text-muted-foreground sm:block">
                  polished ecommerce demo
                </p>
              </div>
            </Link>
          </li>
          <li className="relative flex items-center rounded-full border border-border/70 bg-background/80 hover:bg-muted">
            <CartDrawer />
          </li>
          <li className="flex items-center justify-center">
            {!session ? (
              <Button asChild className="cursor-pointer rounded-full px-5">
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
