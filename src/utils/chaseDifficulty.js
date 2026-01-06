export function calculateChaseDifficulty({
  runs,
  wickets,
  overs,
  target,
  matchType,
}) {
  if (!target || target <= 0) return null;

  // 1. Format configuration
  const maxOvers = matchType?.toLowerCase() === "t20" ? 20 : 50;
  const totalBalls = maxOvers * 6;

  // 2. Precise Ball Calculation 
  // Handles the ".1, .2..." notation correctly
  const completedOvers = Math.floor(overs);
  const ballsInCurrentOver = Math.round((overs % 1) * 10);
  const ballsBowled = completedOvers * 6 + ballsInCurrentOver;
  const ballsLeft = Math.max(0, totalBalls - ballsBowled);

  if (ballsLeft <= 0) return null;

  // 3. Game Stats
  const runsLeft = Math.max(0, target - runs);
  const wicketsLeft = 10 - wickets;

  // 4. Run Rate Calculations (with safety fallbacks)
  const requiredRR = (runsLeft * 6) / ballsLeft;
  const currentRR = runs / Math.max(overs, 0.1); // Avoid dividing by 0
  const safetyCurrentRR = Math.max(currentRR, 4); // Assume base pressure is at least relative to a 4 RR

  /* -------- IMPROVED PRESSURE CALCULATION -------- */

  // A: RR Pressure - How much faster do we need to go?
  let rrPressure = (requiredRR / safetyCurrentRR) * 40;

  // B: Context Pressure - How late in the game is it?
  let timePressure = (ballsBowled / totalBalls) * 35;

  // C: Resource Pressure - How many wickets are left?
  let wicketPressure = 0;
  if (wicketsLeft <= 2) wicketPressure = 25;
  else if (wicketsLeft <= 4) wicketPressure = 15;
  else if (wicketsLeft <= 5) wicketPressure = 5;

  let difficulty = clamp(rrPressure + timePressure + wicketPressure, 0, 100);

  /* -------- LOGIC OVERRIDES (Human-like Judgment) -------- */
  let level = "Comfortable";
  let color = "#16a34a"; // Green

  if (difficulty > 40 || requiredRR > 8) {
    level = "Moderate";
    color = "#3b82f6"; // Blue
  }

  if (difficulty > 65 || requiredRR > 10 || wicketsLeft <= 4) {
    level = "Tight";
    color = "#f59e0b"; // Orange
  }

  if (difficulty > 85 || requiredRR > 13 || wicketsLeft <= 2) {
    level = "Extreme";
    color = "#dc2626"; // Red
  }

  return {
    difficulty: Math.round(difficulty),
    level,
    color,
    requiredRR: requiredRR.toFixed(1),
    ballsLeft,
    wicketsLeft,
  };
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}