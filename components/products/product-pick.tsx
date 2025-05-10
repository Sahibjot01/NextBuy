"use client";

import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ProductPick({
  id,
  color,
  productType,
  title,
  price,
  productID,
  image,
}: {
  id: number;
  color: string;
  productType: string;
  title: string;
  price: number;
  productID: number;
  image: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedType = searchParams.get("type");

  return (
    <div
      onClick={() =>
        router.push(
          `/products/${id}?id=${id}&productID=${productID}&price=${price}&title=${title}&type=${productType}&image=${image}&color=${color}`,
          {
            scroll: false,
          }
        )
      }
      className={cn(
        "w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ease-in-out hover:opacity-75",
        selectedType === productType ? "ring-2 ring-primary" : "",
        selectedType !== productType ? "opacity-50" : "opacity-100"
      )}
      style={{ backgroundColor: color }}
    ></div>
  );
}
