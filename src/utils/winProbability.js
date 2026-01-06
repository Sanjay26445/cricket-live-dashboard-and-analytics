/**
 * Calculates a dynamic Win Probability based on match type and current state.
 */
export function calculateWinProbability({
  runs,
  wickets,
  overs,
  target,
  matchType,
  scoreArray,
  isAhead
}) {
  const type = matchType?.toLowerCase() || "";
  const isTest = type.includes("test");
  const isT20 = type.includes("t20");
  const maxOvers = isT20 ? 20 : 50;

  /* ---------------- TEST MATCH LOGIC ---------------- */
  if (isTest) {
    if (!scoreArray || scoreArray.length === 0) return { batting: 50, bowling: 50 };

    // Innings 1: Basic strength check
    if (scoreArray.length === 1) {
      const crr = runs / (overs || 1);
      if (crr > 4.5 && wickets < 3) return { batting: 65, bowling: 35 };
      if (wickets > 7) return { batting: 30, bowling: 70 };
      return { batting: 50, bowling: 50 };
    }

    // Innings 2, 3, or 4: Calculate total lead/trail
    const team1Total = scoreArray.filter((_, i) => i % 2 === 0).reduce((a, b) => a + b.r, 0);
    const team2Total = scoreArray.filter((_, i) => i % 2 !== 0).reduce((a, b) => a + b.r, 0);
    
    const isTeam1BattingNow = scoreArray.length % 2 !== 0; 
    const lead = isTeam1BattingNow ? team1Total - team2Total : team2Total - team1Total;

    let testBattingProb = 50 + (lead / 5); // 5 runs lead = 1% shift
    testBattingProb = clamp(testBattingProb, 10, 90);

    return {
      batting: Math.round(testBattingProb),
      bowling: 100 - Math.round(testBattingProb),
    };
  }

  /* ---------------- LIMITED OVERS LOGIC ---------------- */
  const wholeOvers = Math.floor(overs);
  const currentBalls = Math.round((overs * 10) % 10);
  const totalBallsBowled = (wholeOvers * 6) + Math.min(currentBalls, 6);
  const totalInningsBalls = maxOvers * 6;
  const ballsLeft = Math.max(0, totalInningsBalls - totalBallsBowled);
  const progress = totalBallsBowled / totalInningsBalls;

  // SECOND INNINGS
  if (target && ballsLeft > 0) {
    const runsLeft = target - runs;
    const wicketsLeft = 10 - wickets;
    const rrr = (runsLeft * 6) / ballsLeft;

    const difficultRRR = isT20 ? 12 : 9;
    const comfortableRRR = isT20 ? 8 : 6.5;
    
    let battingProb = 50;
    
    if (rrr <= comfortableRRR) {
      battingProb = 75 + (comfortableRRR - rrr) * 3;
    } else if (rrr <= difficultRRR) {
      battingProb = 50 + (difficultRRR - rrr) * 5;
    } else {
      battingProb = 30 - (rrr - difficultRRR) * 2;
    }
    
    const wicketBonus = (wicketsLeft - 5) * 4; 
    battingProb += wicketBonus;
    
    if (progress > 0.85) battingProb += wicketsLeft * 2;
    if (isAhead !== undefined) battingProb += isAhead ? 10 : -10;

    battingProb = clamp(battingProb, 5, 95);

    return {
      batting: Math.round(battingProb),
      bowling: 100 - Math.round(battingProb),
    };
  }

  // FIRST INNINGS
  if (totalBallsBowled < 12) return { batting: 50, bowling: 50 };

  const normalizedOvers = totalBallsBowled / 6;
  const currentRR = runs / normalizedOvers;
  const projected = currentRR * maxOvers;
  const wicketPenalty = isT20 ? wickets * 8 : wickets * 6;
  const adjustedProjection = projected - wicketPenalty;
  const parScore = isT20 ? 165 : 285;
  const diff = adjustedProjection - parScore;

  let batting = 50 + (diff / 4);
  batting = clamp(batting, 20, 80); 

  return {
    batting: Math.round(batting),
    bowling: 100 - Math.round(batting),
  };
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}