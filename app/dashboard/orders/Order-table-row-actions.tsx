"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { ordersProductsWithProductAndVariant } from "@/lib/infer-type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { DialogDescription } from "@radix-ui/react-dialog";

export default function OrderTableRowActions({
  orderProduct,
  orderId,
  totalPrice,
  receiptUrl,
}: {
  orderProduct: ordersProductsWithProductAndVariant[];
  orderId: number;
  totalPrice: number;
  receiptUrl?: string;
}) {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <DialogTrigger className=" text-left" asChild>
              <Button className="w-full" variant={"ghost"}>
                View Details
              </Button>
            </DialogTrigger>
          </DropdownMenuItem>
          {receiptUrl ? (
            <DropdownMenuItem>
              <Button className="w-full" variant={"ghost"} asChild>
                <Link href={receiptUrl} target="_blank">
                  Download Invoice
                </Link>
              </Button>
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Order Details #{orderId}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center">
          Your Total is ${totalPrice}
        </DialogDescription>
        <Card className="overflow-auto p-2 flex flex-col gap-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderProduct.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Image
                      src={item.productVariants.variantImages[0].url}
                      alt={item.product.title || "Product"}
                      width={48}
                      height={48}
                      className="rounded-md"
                    />
                  </TableCell>
                  <TableCell>${item.product.price}</TableCell>
                  <TableCell>{item.product.title || "Unknown"}</TableCell>
                  <TableCell>
                    <div
                      style={{ background: item.productVariants.color }}
                      className="w-4 h-4 rounded-full"
                    ></div>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
