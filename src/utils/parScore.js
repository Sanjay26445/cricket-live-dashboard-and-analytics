import { toTotalBalls } from "./runRate";

export function calculateParScore({ runs, wickets, overs, target, matchType }) {
  if (!target || !overs) return null;

  const isT20 = matchType?.toLowerCase().includes("t20");
  const maxOvers = isT20 ? 20 : 50;
  const totalBalls = maxOvers * 6;
  const ballsCompleted = toTotalBalls(overs);
  
  // 1. Calculate Ball Progress (0 to 1)
  const progress = ballsCompleted / totalBalls;

  /**
   * 2. The DLS Resource Curve
   * In real DLS, as the game nears the end, wickets become less 'expensive' 
   * if you have many left. We use an exponential decay for wickets.
   */
  const wicketsLost = Math.min(wickets || 0, 10);
  
  // This factor represents how much 'strength' the team has left based on wickets
  // 0 wickets lost = 1.0 strength | 10 wickets lost = 0.0 strength
  const resourceStrength = Math.pow((10 - wicketsLost) / 10, 0.5);

  /**
   * 3. Calculate Par
   * Instead of adding a penalty, we calculate what % of the target 
   * the team SHOULD have reached.
   * At 90% balls used, with 50% wickets left, a team is 'safe'.
   */
  // Adjustment: In the final 20% of the match, wickets in hand lower the par significantly
  const intensityFactor = progress > 0.8 ? 0.9 : 1.0;
  
  // The 'Standard' par would be Target * Progress
  // We adjust this based on whether they have more or less than 5 wickets down
  const wicketAdjustment = (wicketsLost - 4) * 0.05; 
  
  let expectedPar = target * progress * intensityFactor * (1 + wicketAdjustment);

  // 4. Safety Caps
  if (expectedPar > target - 1) expectedPar = target - 1;
  if (ballsCompleted === 0) expectedPar = 0;

  const finalPar = Math.round(expectedPar);
  const diff = runs - finalPar;

  return {
    par: finalPar,
    diff,
    status: diff >= 0 ? `Ahead by ${diff}` : `Behind by ${Math.abs(diff)}`,
    isAhead: diff >= 0
  };
}