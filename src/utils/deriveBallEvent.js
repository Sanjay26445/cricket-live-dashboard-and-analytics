export default function deriveBallEvent(prev, curr) {
  if (!prev || !curr) return null;

  const runDiff = curr.r - prev.r;
  const wicketDiff = curr.w - prev.w;
  const overDiff = curr.o !== prev.o;

  // 1. Wicket happened
  if (wicketDiff > 0) return "W";

  // 2. No runs, but over changed = Dot Ball
  if (runDiff === 0 && overDiff) return "0";

  // 3. Runs were scored
  if (runDiff > 0) {
    // Detect if it was a Wide/No Ball (Runs up, but over didn't move)
    if (!overDiff && runDiff === 1) return "Ex"; 
    
    // Return the actual number of runs (4, 6, 1, etc.)
    return runDiff.toString();
  }

  return null;
}