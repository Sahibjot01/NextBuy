//card of one single review
"use client";
import { reviewsWithUser } from "@/lib/infer-type";
import { motion } from "motion/react";
import { Card } from "../ui/card";
import Image from "next/image";
import { formatDistance, subDays } from "date-fns";
import Stars from "./stars";
import { Avatar, AvatarFallback } from "../ui/avatar";

export default function Review({ reviews }: { reviews: reviewsWithUser[] }) {
  return (
    <motion.div className="flex flex-col gap-4">
      {reviews.length === 0 && (
        <p className="py-2 font-medium">No reviews yet</p>
      )}
      {reviews.map((review) => (
        <Card key={review.id} className="p-4">
          <div className="flex gap-2 items-center">
            <Avatar className="w-7 h-7">
              {review.user.image ? (
                <Image
                  src={review.user.image}
                  alt={review.user.name!}
                  fill={true}
                />
              ) : (
                <AvatarFallback className="bg-primary/25">
                  <div className="font-bold">
                    {review.user.name?.charAt(0).toUpperCase()}
                  </div>
                </AvatarFallback>
              )}
            </Avatar>

            <div>
              <p className="text-sm font-bold">{review.user.name}</p>
              <div className="flex gap-2 items-center">
                <Stars rating={review.rating} />
                <p className="text-xs text-bold text-muted-foreground">
                  {formatDistance(subDays(review.created!, 0), new Date())}
                </p>
              </div>
            </div>
          </div>
          <p className="py-2 font-medium">{review.comment}</p>
        </Card>
      ))}
    </motion.div>
  );
}
