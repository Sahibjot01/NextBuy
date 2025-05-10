import { db } from "@/server";
import { auth } from "@/server/auth";
import { orders } from "@/server/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import OrdersTable from "./orders-table";

export default async function Orders() {
  //check for user
  const user = await auth();
  if (!user) {
    return redirect("/auth/login");
  }

  //get order from user.id
  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userID, user.user.id),
    with: {
      orderProducts: {
        with: {
          product: true,
          productVariants: { with: { variantImages: true } },
        },
      },
    },
    orderBy: (orders, { desc }) => [desc(orders.created)],
  });
  return <OrdersTable userOrders={userOrders} />;
}
