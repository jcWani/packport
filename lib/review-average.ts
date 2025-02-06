export const getReviewAverage = (reviews: number[]) => {
  if (reviews.length === 0) return 0;

  return reviews.reduce((acc, cur) => acc + cur, 0) / reviews.length;
};
