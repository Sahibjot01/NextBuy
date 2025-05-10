"use client";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { variantWithImagesTags } from "@/lib/infer-type";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductShowcase({
  variants,
}: {
  variants: variantWithImagesTags[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeThumbnail, setActiveThumbnail] = useState([0]);
  const searchParams = useSearchParams();
  const selectedType = searchParams.get("type");

  useEffect(() => {
    if (!api) return;

    api.on("slidesInView", (e) => {
      setActiveThumbnail(e.slidesInView());
    });
  }, [api]);
  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <CarouselContent>
        {variants.map(
          (variant) =>
            variant.productType === selectedType &&
            variant.variantImages.map((image) => (
              <CarouselItem key={image.url}>
                {image.url ? (
                  <Image
                    priority
                    width={1280}
                    height={720}
                    className="rounded-md"
                    alt={image.name}
                    src={image.url}
                  />
                ) : null}
              </CarouselItem>
            ))
        )}
      </CarouselContent>
      <div className="flex overflow-clip py-2 gap-4">
        {variants.map(
          (variant) =>
            variant.productType === selectedType &&
            variant.variantImages.map((image, imageIDX) => (
              <div key={image.url}>
                {image.url ? (
                  <Image
                    priority
                    width={72}
                    height={48}
                    onClick={() => api?.scrollTo(imageIDX)}
                    className={cn(
                      imageIDX === activeThumbnail[0]
                        ? "opacity-100"
                        : "opacity-50",
                      "rounded-md cursor-pointer transition-all duration-300 ease-in-out hover:opacity-75"
                    )}
                    alt={image.name}
                    src={image.url}
                  />
                ) : null}
              </div>
            ))
        )}
      </div>
    </Carousel>
  );
}
