export const calculateTrustScore = (user) => {
  let score = 0;

  if (user.verification?.status === "approved") score += 40;

  score += user.ratings?.average * 10;

  if (user.ratings?.count > 10) score += 20;

  if (user.ratings?.average >= 4) score += 20;

  return Math.min(score, 100);
};