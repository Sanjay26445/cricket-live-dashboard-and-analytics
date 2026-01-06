export const toTotalBalls = (overs) => {
  if (!overs || overs === 0) return 0;
  const overParts = overs.toString().split(".");
  const wholeOvers = parseInt(overParts[0], 10) || 0;
  const extraBalls = overParts[1] ? parseInt(overParts[1], 10) : 0;
  return (wholeOvers * 6) + Math.min(extraBalls, 6);
};

export function calculateCRR({ runs, overs }) {
  const totalBalls = toTotalBalls(overs);
  if (totalBalls <= 0) return "0.00";
  return ((runs / totalBalls) * 6).toFixed(2);
}

export function calculateRRR({ runs, overs, target, matchType }) {
  if (!target) return null;
  const isT20 = matchType?.toLowerCase().includes("t20");
  const maxOvers = isT20 ? 20 : 50;
  const totalInningsBalls = maxOvers * 6;
  const ballsBowled = toTotalBalls(overs);
  const ballsLeft = Math.max(0, totalInningsBalls - ballsBowled);

  if (ballsLeft <= 0) return null;
  const runsLeft = target - runs;
  const rrr = (runsLeft * 6) / ballsLeft;
  return isFinite(rrr) ? rrr.toFixed(2) : "0.00";
}