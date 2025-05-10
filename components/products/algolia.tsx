"use client";
import { Hits, SearchBox, InstantSearch } from "react-instantsearch";
import { searchClient } from "@/lib/agolia-client";
import Link from "next/link";
import Image from "next/image";
import { Card } from "../ui/card";
import formatPrice from "@/lib/formatPrice";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Algolia() {
  const [active, setActive] = useState(false);

  const MotionCard = useMemo(() => motion.create(Card), []);
  return (
    <InstantSearch
      indexName="products"
      searchClient={searchClient}
      future={{
        persistHierarchicalRootCount: true,
        preserveSharedStateOnUnmount: true,
      }}
    >
      <div className="relative">
        <SearchBox
          onFocus={() => setActive(true)}
          onBlur={() => setTimeout(() => setActive(false), 100)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setActive(false);
            }
          }}
          placeholder="Search for products"
          classNames={{
            input:
              " h-full w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            submitIcon: "absolute text-white right-2 top-3 h-4 w-4",
            form: "relative h-10 mb-4",
            resetIcon: "hidden",
          }}
        />
        <AnimatePresence>
          {active && (
            <MotionCard
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute w-full z-50 overflow-y-scroll h-96"
            >
              <Hits hitComponent={Hit} />
            </MotionCard>
          )}
        </AnimatePresence>
      </div>
    </InstantSearch>
  );
}

function Hit({
  hit,
}: {
  hit: {
    objectID: string;
    id: number;
    title: string;
    price: number;
    variantImage: string;
    productType: string;
    _highlightResult: {
      title: {
        value: string;
        matchLevel: string;
        fullyHighlighted: boolean;
        matchedWords: string[];
      };
      productType: {
        value: string;
        matchLevel: string;
        fullyHighlighted: boolean;
        matchedWords: string[];
      };
    };
  };
}) {
  return (
    <div className="p-4 mb-2 hover:bg-secondary">
      <Link
        href={`/products/${hit.objectID}?id=${hit.objectID}&productID=${hit.id}&price=${hit.price}&title=${hit.title}&type=${hit.productType}&image=${hit.variantImage}&variantID=${hit.objectID}`}
      >
        <div className="flex items-center justify-between gap-12 w-full">
          <Image
            src={hit.variantImage}
            alt={hit.title}
            width={60}
            height={60}
            className="rounded-md"
          />
          <p
            className="text-sm "
            dangerouslySetInnerHTML={{
              __html: hit._highlightResult.title.value,
            }}
          ></p>
          <p
            className="text-sm "
            dangerouslySetInnerHTML={{
              __html: hit._highlightResult.productType.value,
            }}
          ></p>
          <p className="font-medium">{formatPrice(hit.price)}</p>
        </div>
      </Link>
    </div>
  );
}
