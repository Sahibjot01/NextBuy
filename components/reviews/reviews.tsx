import { db } from "@/server";
import ReviewForm from "./review-form";
import { desc, eq } from "drizzle-orm";
import { reviews } from "@/server/schema";
import Review from "./review";
import ReviewChart from "./review-chart";

export default async function Reviews({ productID }: { productID: number }) {
  const data = await db.query.reviews.findMany({
    where: eq(reviews.productID, productID),
    with: {
      user: true,
    },
    orderBy: [desc(reviews.created)],
  });
  return (
    <section className="py-4">
      <h2 className="font-bold text-2xl mb-4">Product Reviews</h2>
      <div className="flex gap-2 flex-col justify-stretch lg:gap-12 lg:flex-row">
        <div className="flex-1">
          <ReviewForm />
          <Review reviews={data} />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <ReviewChart reviews={data} />
        </div>
      </div>
    </section>
  );
}
