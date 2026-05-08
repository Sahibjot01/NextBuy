"use client";
import { Hits, SearchBox, InstantSearch } from "react-instantsearch";
import { searchClient } from "@/lib/agolia-client";
import Link from "next/link";
import Image from "next/image";
import { Card } from "../ui/card";
import formatPrice from "@/lib/formatPrice";
import { useMemo, useState } from "react";
import DOMPurify from "isomorphic-dompurify";
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
              "h-full w-full rounded-full border border-border/70 bg-background px-5 py-3 pl-12 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            submitIcon: "absolute left-4 top-3.5 h-4 w-4 text-muted-foreground",
            form: "relative mb-4 h-12",
            resetIcon: "hidden",
          }}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Search by product, type, or color. Hit{" "}
          <span className="font-medium">Esc</span> to close results.
        </p>
        <AnimatePresence>
          {active && (
            <MotionCard
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute z-50 mt-3 h-96 w-full overflow-y-scroll rounded-3xl border border-border/70 bg-background/95 p-2 shadow-2xl backdrop-blur"
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
    <div className="mb-2 rounded-2xl p-3 transition hover:bg-secondary/70">
      <Link
        href={`/products/${hit.objectID}?id=${hit.objectID}&productID=${hit.id}&price=${hit.price}&title=${hit.title}&type=${hit.productType}&image=${hit.variantImage}&variantID=${hit.objectID}`}
      >
        <div className="flex w-full items-center justify-between gap-4">
          <Image
            src={hit.variantImage}
            alt={hit.title}
            width={60}
            height={60}
            className="h-14 w-14 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-sm font-semibold"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  hit._highlightResult.title.value || "",
                ),
              }}
            />
            <p
              className="truncate text-xs text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  hit._highlightResult.productType.value || "",
                ),
              }}
            />
          </div>
          <p className="rounded-full bg-secondary px-3 py-1 text-sm font-medium">
            {formatPrice(hit.price)}
          </p>
        </div>
      </Link>
    </div>
  );
}
