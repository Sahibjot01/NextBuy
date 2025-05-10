"use client";

import { Card, CardDescription, CardTitle } from "../ui/card";
import { reviewsWithUser } from "@/lib/infer-type";
import Stars from "@/components/reviews/stars";
import { getReviewAverage } from "@/lib/getReviewAverage";
import { useMemo } from "react";
import { Progress } from "../ui/progress";

export default function ReviewChart({
  reviews,
}: {
  reviews: reviewsWithUser[];
}) {
  const getRatingByStars = useMemo(() => {
    const ratingValue = Array.from({ length: 5 }, () => 0);
    const totalReviews = reviews.length;
    reviews.forEach((review) => {
      const rating = review.rating;
      if (rating >= 1 && rating <= 5) {
        ratingValue[rating - 1] += 1;
      }
    });
    return ratingValue.map((value) => (value / totalReviews) * 100);
  }, [reviews]);
  const totalRating = getReviewAverage(reviews.map((r) => r.rating));
  return (
    <Card className="flex flex-col p-8 rounded-md gap-4">
      <div className="flex flex-col gap-2">
        <CardTitle>Product Rating:</CardTitle>
        <CardDescription className="text-lg font-medium">
          {totalRating.toFixed(1)} stars
        </CardDescription>
      </div>
      {getRatingByStars.map((value, index) => (
        <div className="flex gap-2 justify-between items-center" key={index}>
          <p className="text-sm font-medium flex gap-1">
            {index + 1} <span>stars</span>
          </p>
          <Progress value={value} className="h-4 rounded-sm" />
        </div>
      ))}
    </Card>
  );
}
