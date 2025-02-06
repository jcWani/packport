"use client";

import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductTags() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag");

  const setFilter = (tag: string) => {
    if (!tag) router.push("/");
    if (tag) router.push(`?tag=${tag}`);
  };

  return (
    <div className="my-4 flex gap-4 items-center justify-center">
      <Badge
        onClick={() => setFilter("")}
        className={cn(
          "bg-black hover:bg-black-75 hover:opacity-100",
          !tag ? "opacity-100" : "opacity-50 cursor-pointer"
        )}
      >
        All
      </Badge>
      <Badge
        onClick={() => setFilter("backpack")}
        className={cn(
          " bg-red-500 hover:bg-red-600 hover:opacity-100",
          tag === "backpack" && tag
            ? "opacity-100"
            : "opacity-50 cursor-pointer"
        )}
      >
        Backpack
      </Badge>
      <Badge
        onClick={() => setFilter("sling")}
        className={cn(
          "bg-yellow-500 hover:bg-yellow-600 hover:opacity-100",
          tag === "sling" && tag ? "opacity-100" : "opacity-50 cursor-pointer"
        )}
      >
        Sling
      </Badge>
      <Badge
        onClick={() => setFilter("tote")}
        className={cn(
          "bg-orange-500 hover:bg-orange-600 hover:opacity-100",
          tag === "tote" && tag ? "opacity-100" : "opacity-50 cursor-pointer"
        )}
      >
        Tote
      </Badge>
      <Badge
        onClick={() => setFilter("duffel")}
        className={cn(
          "bg-purple-500 hover:bg-purple-600 hover:opacity-100",
          tag === "duffel" && tag ? "opacity-100" : "opacity-50 cursor-pointer"
        )}
      >
        Duffel
      </Badge>
    </div>
  );
}
