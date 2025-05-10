import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/server";
import Sales from "./sales";
import Revenue from "./revenue";

export const revalidate = 0;

export default async function Analytics() {
  //get all the orderproducts from db
  const totalOrders = await db.query.orderProducts.findMany({
    orderBy: (orderProducts, { desc }) => [desc(orderProducts.id)],
    limit: 7,
    with: {
      product: true,
      productVariants: {
        with: { variantImages: true },
      },
      order: {
        with: {
          user: true,
        },
      },
    },
  });
  if (!totalOrders || totalOrders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Orders</CardTitle>
          <CardDescription>
            You have not received any orders yet. Please check back later.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  if (totalOrders) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Analytics</CardTitle>
          <CardDescription>
            Check your sales, new customers and more
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col lg:flex-row gap-8">
          <Sales totalOrders={totalOrders} />
          <Revenue totalOrders={totalOrders} />
        </CardContent>
      </Card>
    );
  }
}
