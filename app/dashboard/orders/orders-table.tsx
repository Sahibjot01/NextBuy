"use client";

import { ordersWithProductAndVaraint } from "@/lib/infer-type";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistance, subMinutes } from "date-fns";
import { Badge } from "@/components/ui/badge";
import OrderTableRowActions from "./Order-table-row-actions";
import formatPrice from "@/lib/formatPrice";

export default function OrdersTable({
  userOrders,
}: {
  userOrders: ordersWithProductAndVaraint[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Orders</CardTitle>
        <CardDescription>Check the status of your orders</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{formatPrice(order.total)}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      order.status === "succeeded"
                        ? "bg-green-700 dark:bg-green-500 hover:dark:bg-green-600 hover:bg-green-800"
                        : order.status === "failed"
                          ? "bg-red-700 dark:bg-red-500 hover:bg-red-800"
                          : "bg-yellow-700 hover:bg-yellow-800"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDistance(subMinutes(order.created!, 0), new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  <OrderTableRowActions
                    orderId={order.id}
                    orderProduct={order.orderProducts}
                    totalPrice={order.total}
                    receiptUrl={order.receiptURL!}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
