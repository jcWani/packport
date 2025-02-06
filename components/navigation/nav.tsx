import { auth } from "@/server/auth";
import Link from "next/link";
import Image from "next/image";

import { UserButton } from "./user-button";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import CartDrawer from "../cart/cart-drawer";

export default async function Nav() {
  const session = await auth();

  return (
    <header className="py-8">
      <nav>
        <ul className="flex justify-between items-center md:gap-8 gap-4">
          <li className="flex flex-1">
            <Link href="/" arial-label="Packport">
              <Image
                src={"/logo.png"}
                alt="Packport logo"
                width={250}
                height={250}
                className="w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 h-auto dark:brightness-0 dark:invert transition-all duration-300  ease-in-out"
              />
            </Link>
          </li>
          <li className="relative flex items-center hover:bg-muted">
            <CartDrawer />
          </li>
          {!session ? (
            <li className="flex items-center justify-center">
              <Button asChild>
                <Link href="/auth/login" className="flex gap-2">
                  <LogIn size={16} />
                  <span>LogIn</span>
                </Link>
              </Button>
            </li>
          ) : (
            <li className="flex items-center justify-center">
              <UserButton expires={session?.expires} user={session?.user} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
