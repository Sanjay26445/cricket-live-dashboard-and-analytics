import TeamRow from "./TeamRow";
import WinProbabilityBar from "./WinProbabilityBar";

export default function LiveMatchCard({ match, onClick }) {
  // Determine which team is currently batting (0 or 1)
  const getBattingTeamIndex = () => {
    if (!match.status || !match.teams) return 0;
    
    const statusLower = match.status.toLowerCase();
    const team1Lower = match.teams[0]?.toLowerCase() || "";
    
    // If status mentions "need", it's the second innings; team 2 usually batting
    // but we check if team 1 name is in the 'need' string (e.g. "India need 20 runs")
    if (statusLower.includes("need")) {
      return statusLower.includes(team1Lower) ? 0 : 1;
    }
    
    // Fallback: If status mentions team 1 name specifically, they are batting
    if (statusLower.includes(team1Lower)) return 0;
    
    return 1;
  };

  const battingTeamIndex = getBattingTeamIndex();

  // Helper to highlight the batting team in the score list
  const isBatting = (index) => {
    return index === battingTeamIndex;
  };

  // Logic to ensure the bar fills from the correct side without flipping
  // We map batting/bowling percentages to specific Team 0 (Left) and Team 1 (Right)
  const probTeam0 = battingTeamIndex === 0 ? match.winProb?.batting : match.winProb?.bowling;
  const probTeam1 = battingTeamIndex === 1 ? match.winProb?.batting : match.winProb?.bowling;

  return (
    <div 
      style={styles.card} 
      onClick={onClick}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <div style={styles.badgeGroup}>
          <div style={styles.liveBadge}>
            <span style={styles.pulseDot} />
            LIVE
          </div>
          <span style={styles.format}>{match.matchType?.toUpperCase()}</span>
        </div>
        <div style={styles.venue}>📍 {match.venue || "TBC"}</div>
      </div>

      <h3 style={styles.title}>{match.name}</h3>

      {/* SCORES SECTION */}
      <div style={styles.scoreSection}>
        {match.teams?.map((t, i) => (
          <TeamRow 
            key={i} 
            team={t} 
            score={match.scores?.[i]} 
            isBatting={isBatting(i)} 
          />
        ))}
      </div>

      {/* STATUS BAR */}
      <div style={styles.status}>
        {match.status}
      </div>

      {/* ANALYTICS PREVIEW */}
      <div style={styles.analyticsPreview}>
        {match.winProb ? (
          <WinProbabilityBar
            team0Prob={probTeam0}
            team1Prob={probTeam1}
            teams={match.teams}
          />
        ) : (
          <div style={styles.placeholder}>Analytics updating...</div>
        )}
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  card: {
    background: "var(--card)",
    padding: "20px",
    borderRadius: "18px",
    marginBottom: "20px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    cursor: "pointer",
    transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    border: "1px solid rgba(255,255,255,0.05)",
    color: "var(--text)",
    position: "relative",
    overflow: "hidden"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  },
  badgeGroup: {
    display: "flex",
    gap: "8px",
    alignItems: "center"
  },
  liveBadge: {
    background: "rgba(220, 38, 38, 0.15)",
    color: "#ef4444",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  pulseDot: {
    width: "6px",
    height: "6px",
    background: "#ef4444",
    borderRadius: "50%",
    boxShadow: "0 0 8px #ef4444",
    animation: "pulse 1.5s infinite"
  },
  format: {
    fontSize: "11px",
    fontWeight: "600",
    opacity: 0.5,
    letterSpacing: "0.5px"
  },
  venue: {
    fontSize: "12px",
    opacity: 0.6
  },
  title: {
    margin: "0 0 16px 0",
    fontSize: "18px",
    fontWeight: "700",
    lineHeight: "1.4"
  },
  scoreSection: {
    padding: "12px 0",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  status: {
    marginTop: "12px",
    background: "rgba(22, 163, 74, 0.1)",
    color: "#16a34a",
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "600",
    textAlign: "center"
  },
  analyticsPreview: {
    marginTop: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  placeholder: {
    fontSize: "11px",
    opacity: 0.4,
    textAlign: "center",
    fontStyle: "italic"
  }
};