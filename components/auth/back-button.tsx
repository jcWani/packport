"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export const BackButton = ({
  href,
  label,
}: {
  href: string;
  label: string;
}) => {
  return (
    <Button variant={"link"} className="font-medium w-full" asChild>
      <Link href={href} aria-label={label}>
        {label}
      </Link>
    </Button>
  );
};
