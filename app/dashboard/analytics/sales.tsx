import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { totalOrders } from "@/lib/infer-type";
import Image from "next/image";
import placeholderUser from "@/public/PlaceholderUser.png";
import formatPrice from "@/lib/formatPrice";
import { formatDistance, subMinutes } from "date-fns";

export default function Sales({ totalOrders }: { totalOrders: totalOrders[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Sales</CardTitle>
        <CardDescription>Here are your Recent Sales</CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Order Created</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {totalOrders.map(
              ({ order, product, quantity, productVariants }) => (
                <TableRow
                  key={(order.id + " " + productVariants.id).toString()}
                  className="font-medium"
                >
                  <TableCell>
                    <div className="flex gap-2 w-32 items-center ">
                      {order.user.image && order.user.name && (
                        <>
                          <Image
                            src={order.user.image}
                            width={25}
                            height={25}
                            alt={order.user.name}
                            className="rounded-full"
                          />
                          <p className="text-xs">{order.user.name}</p>
                        </>
                      )}
                      {!order.user.image && order.user.name && (
                        <>
                          <Image
                            src={placeholderUser}
                            width={25}
                            height={25}
                            alt="user not found"
                            className="rounded-full"
                          />
                          <p className="text-xs">{order.user.name}</p>
                        </>
                      )}
                      {!order.user.image && !order.user.name && (
                        <>
                          <Image
                            src={placeholderUser}
                            width={25}
                            height={25}
                            alt="user not found"
                            className="rounded-full"
                          />
                          <p className="text-xs">User not found</p>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>{quantity}</TableCell>
                  <TableCell>
                    {formatDistance(subMinutes(order.created!, 0), new Date(), {
                      addSuffix: true,
                    })}{" "}
                  </TableCell>
                  <TableCell>
                    <Image
                      src={productVariants.variantImages[0].url}
                      height={48}
                      width={48}
                      alt={product.title + " " + productVariants.productType}
                      className="rounded-md"
                    />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
