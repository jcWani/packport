"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LinkItem {
  label: string;
  path: string;
  icon: ReactNode;
}

export default function DashboardNav({ allLinks }: { allLinks: LinkItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="py-2 overflow-auto mb-4">
      <ul className="flex gap-6 text-xs font-semibold">
        <AnimatePresence>
          {allLinks.map((link) => (
            <motion.li whileTap={{ scale: 0.95 }} key={link.path}>
              <Link
                href={link.path}
                className={cn(
                  "flex gap-1 flex-col items-center relative",
                  pathname === link.path && "text-primary"
                )}
              >
                {link.icon}
                {link.label}
                {pathname === link.path ? (
                  <motion.div
                    className="h-[2px] w-full rounded-full absolute bg-primary z-0 left-0 -bottom-1"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    layoutId="underline"
                    transition={{ type: "spring", stiffness: 35 }}
                  />
                ) : null}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </nav>
  );
}
