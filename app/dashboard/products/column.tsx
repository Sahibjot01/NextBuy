"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { DataTableRowActions } from "./data-table-row-actions";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, PlusCircle } from "lucide-react";
import { variantWithImagesTags } from "@/lib/infer-type";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProductVariant from "./product-variant";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: number;
  title: string;
  price: number;
  image: string;
  variants: variantWithImagesTags[];
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.getValue("title")}</div>;
    },
  },
  {
    accessorKey: "variants",
    header: "Variants",
    cell: ({ row }) => {
      const variants = row.getValue("variants") as variantWithImagesTags[];
      return (
        <div className="flex gap-2 items-center">
          {variants.map((variant) => (
            <div key={variant.id}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <ProductVariant
                        productID={variant.productID}
                        editMode={true}
                        variant={variant}
                      >
                        <div
                          className="h-5 w-5 border-2 rounded-full"
                          key={variant.id}
                          style={{ backgroundColor: variant.color }}
                        />
                      </ProductVariant>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={7}>
                    <p>{variant.productType}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {/* if edit mode is false means create  */}
                <span>
                  <ProductVariant editMode={false} productID={row.original.id}>
                    <PlusCircle className="text-primary w-5 h-5" />
                  </ProductVariant>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new variant</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const cellImage = row.getValue("image") as string;
      const cellTitle = row.getValue("title") as string;
      return (
        <div className="">
          <Image
            src={cellImage}
            alt={cellTitle}
            width={50}
            height={50}
            className="rounded-md"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
