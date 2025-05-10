"use client";
//for dropdown
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { ProductColumn } from "./column";
import { deleteProduct } from "@/server/action/delete-product";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import Link from "next/link";

export function DataTableRowActions({ row }: { row: Row<ProductColumn> }) {
  const product = row.original;

  const { status, execute } = useAction(deleteProduct, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        toast.error(data.error, {
          id: "deleting-product",
        });
      }
      if (data?.success) {
        toast.success(data.success, {
          id: "deleting-product",
        });
      }
    },
    onError: (error) => {
      toast.error("Failed to delete product", {
        id: "deleting-product",
      });
    },
    onExecute: () => {
      toast.loading(`Deleting product ${product.title}`, {
        id: "deleting-product",
      });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="p-0 w-8 h-8 rounded-sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href={`/dashboard/add-product?id=${product.id}`}>
            Edit Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={status === "executing"}
          onClick={() => execute({ id: product.id })}
          className="focus:bg-destructive/20 dark:focus:bg-destructive/50"
        >
          Delete Product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
