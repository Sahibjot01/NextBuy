"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export default function ProductTags() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag");

  const setFilter = (tag: string) => {
    if (tag) router.push(`?tag=${tag}`);
    else router.push("/");
  };
  return (
    <div className="flex my-4 gap-2 justify-center items-center">
      <Badge
        onClick={() => setFilter("")}
        className={cn(
          "cursor-pointer text-sm bg-secondary-foreground hover:bg-black/75 hover:opacity-100",
          !tag ? "opacity-100" : "opacity-50"
        )}
      >
        All
      </Badge>
      <Badge
        onClick={() => setFilter("blue")}
        className={cn(
          "cursor-pointer text-sm bg-blue-500 hover:bg-blue-600 hover:opacity-100",
          tag === "blue" ? "opacity-100" : "opacity-50"
        )}
      >
        Blue
      </Badge>
      <Badge
        onClick={() => setFilter("pink")}
        className={cn(
          "cursor-pointer text-sm bg-pink-500 hover:bg-pink-600 hover:opacity-100",
          tag === "pink" ? "opacity-100" : "opacity-50"
        )}
      >
        Pink
      </Badge>
      <Badge
        onClick={() => setFilter("green")}
        className={cn(
          "cursor-pointer text-sm bg-green-500 hover:bg-green-600 hover:opacity-100",
          tag === "green" ? "opacity-100" : "opacity-50"
        )}
      >
        Green
      </Badge>
    </div>
  );
}
