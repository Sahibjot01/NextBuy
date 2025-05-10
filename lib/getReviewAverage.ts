export const getReviewAverage = (reviews: number[]) => {
  if (reviews.length === 0) {
    return 0;
  }
  const total = reviews.reduce((acc, review) => acc + review, 0);
  const average = total / reviews.length;
  return average;
};
