"use client";

import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src={"/logo.png"}
      alt="Packport logo"
      width={250}
      height={250}
      className="w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 h-auto dark:brightness-0 dark:invert transition-all duration-500  ease-in-out"
    />
  );
}
