export function calculateProjectedScore({
  runs,
  wickets,
  overs,
  matchType,
}) {
  const isT20 = matchType?.toLowerCase() === "t20";
  const maxOvers = isT20 ? 20 : 50;

  const normalizedOvers = normalizeOvers(overs);
  
  // Safety: If match hasn't started or is over
  if (normalizedOvers <= 0) return { lower: 0, upper: 0 };
  if (normalizedOvers >= maxOvers) return { lower: runs, upper: runs };

  const oversLeft = maxOvers - normalizedOvers;
  const currentRR = runs / normalizedOvers;

  /* -------- WICKET & MOMENTUM FACTOR -------- */
  // Base factor: 1.0 (100% of current RR)
  // We reduce this based on wickets, but increase it slightly if near the end (Death Overs)
  
  let wicketPenalty = isT20 ? (wickets * 0.04) : (wickets * 0.03);
  let deathOverBonus = (normalizedOvers / maxOvers) * 0.15; // Teams accelerate at the end

  const wicketFactor = Math.max(0.7, (1.0 - wicketPenalty + deathOverBonus));

  const projectedRemaining = currentRR * oversLeft * wicketFactor;
  const projectedTotal = runs + projectedRemaining;

  // Range logic: T20s are more volatile than ODIs
  const variance = isT20 ? 10 : 15;

  return {
    lower: Math.round(projectedTotal - variance),
    upper: Math.round(projectedTotal + variance),
    total: Math.round(projectedTotal)
  };
}

/**
 * Robustly converts "10.3" (10 overs, 3 balls) to "10.5" mathematical overs.
 */
function normalizeOvers(overs) {
  const wholeOvers = Math.floor(overs);
  // Using Math.round and multiplying by 10 to avoid JS floating point errors
  const balls = Math.round((overs * 10) % 10); 
  
  // Safety: A bowler can't bowl more than 6 balls in a normal over
  const sanctionedBalls = Math.min(balls, 6); 
  
  return wholeOvers + sanctionedBalls / 6;
}