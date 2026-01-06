import TeamRow from "./TeamRow"; 

export default function CompletedMatchCard({ match, onClick }) {
  /* ---------------- 1. DATA NORMALIZATION (CRITICAL FOR DEMO DATA) ---------------- */
  
  // Extract team names: Handle API (match.teams) and Demo (match.name)
  const getTeams = () => {
    if (match.teams && match.teams.length >= 2) return match.teams;
    if (match.name && match.name.includes(" vs ")) {
      // Splits "India vs Sri Lanka" into ["India", "Sri Lanka"]
      return match.name.split(" vs ").map(t => t.trim().replace(" (IPL)", ""));
    }
    return ["Team A", "Team B"];
  };

  const teams = getTeams();

  // Handle Winner Detection
  const getWinner = () => {
    if (!match.status) return null;
    return teams.find(t => match.status.includes(t));
  };
  const winner = getWinner();

  // Handle Scores: Handle Demo (strings) and API (objects)
  const displayScores = match.scores || 
                        match.score?.map(s => `${s.r}/${s.w} (${s.o} ov)`) || 
                        ["", ""];

  /* ---------------- 2. RENDER ---------------- */
  return (
    <div 
      style={styles.card} 
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.08)";
      }}
    >
      <div style={styles.header}>
        <div style={styles.badge}>COMPLETED</div>
        <div style={styles.matchType}>{match.matchType?.toUpperCase() || 'ODI'}</div>
      </div>

      <h3 style={styles.title}>{match.name}</h3>
      <div style={styles.muted}>📍 {match.venue}</div>

      {/* SCORE SECTION - Works for both API and Demo Data */}
      <div style={styles.scoreContainer}>
        {teams.map((teamName, i) => (
          <TeamRow 
            key={i} 
            team={teamName} 
            score={displayScores[i]} 
            isBatting={teamName === winner} // Uses the normalized winner logic
          />
        ))}
      </div>

      <div style={{
        ...styles.result,
        border: winner ? "1px solid rgba(22, 163, 74, 0.2)" : "1px solid rgba(255,255,255,0.1)"
      }}>
        <span style={styles.trophy}>🏆</span> {match.status}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--card)",
    color: "var(--text)",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "18px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "1px solid rgba(255,255,255,0.05)"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
  },
  badge: {
    background: "rgba(0,0,0,0.2)",
    color: "var(--text)",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.5px"
  },
  matchType: {
    fontSize: "12px",
    opacity: 0.5,
    fontWeight: 600
  },
  title: {
    margin: "4px 0",
    fontSize: "18px",
    fontWeight: "700"
  },
  muted: {
    color: "var(--muted)",
    fontSize: "13px",
  },
  scoreContainer: {
    marginTop: "16px",
    padding: "12px 0",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    borderBottom: "1px solid rgba(255,255,255,0.05)"
  },
  result: {
    marginTop: "16px",
    background: "rgba(0,0,0,0.05)",
    color: "var(--text)",
    padding: "12px",
    borderRadius: "12px",
    textAlign: "center",
    fontWeight: 700,
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },
  trophy: {
    fontSize: "16px"
  }
};