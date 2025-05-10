"use client";

import { useCartStore } from "@/lib/client-store";
import { redirect, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
export default function AddToCartButton() {
  const { addToCart } = useCartStore();
  //getting all the params from the url to add product to cart
  const params = useSearchParams();
  const id = Number(params.get("id"));
  const productId = Number(params.get("productID"));
  const title = params.get("title");
  const type = params.get("type");
  const price = Number(params.get("price"));
  const image = params.get("image");
  //temporary state to set quantity
  const [quantity, setQuantity] = useState(1);

  //if any of the params are not present, direct user to the home page
  if (!id || !productId || !title || !type || !price || !image) {
    toast.error("Product not found");
    return redirect("/");
  }
  const handleAddToCart = () => {
    addToCart({
      id: productId,
      name: title + " " + type,
      price: price,
      image: image,
      variant: {
        variantId: id,
        quantity: quantity,
      },
    });
    toast.success(`Added ${title + " " + type} to your cart!`);
  };
  return (
    <>
      <div className="flex items-center my-4 gap-4 justify-stretch">
        <Button
          variant={"secondary"}
          className="text-primary cursor-pointer"
          onClick={() => {
            if (quantity > 1) {
              setQuantity(quantity - 1);
            } else {
              toast.error("Quantity cannot be less than 1");
            }
          }}
        >
          <Minus size={18} strokeWidth={3} />
        </Button>
        <Button className="flex-1 hover:bg-primary">
          Quantity: {quantity}
        </Button>
        <Button
          variant={"secondary"}
          className="text-primary cursor-pointer"
          onClick={() => {
            setQuantity(quantity + 1);
          }}
        >
          <Plus size={18} strokeWidth={3} />
        </Button>
      </div>
      <Button className="cursor-pointer" onClick={handleAddToCart}>
        Add to cart
      </Button>
    </>
  );
}
