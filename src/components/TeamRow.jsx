export default function TeamRow({ team, score, isBatting = false }) {
  if (!team) return null;

  // Better abbreviation logic
  const getTeamCode = (name) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      // "South Africa" -> "RSA" or "SA" (Taking first letter of each word)
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 3).toUpperCase();
  };

  return (
    <div style={{
      ...styles.row,
      opacity: isBatting ? 1 : 0.85 // Dim the team not currently batting
    }}>
      <div style={styles.team}>
        <div style={{
          ...styles.codeContainer,
          border: isBatting ? "1.5px solid #16a34a" : "1.5px solid transparent"
        }}>
          {getTeamCode(team)}
        </div>
        <span style={{ 
          ...styles.teamName, 
          fontWeight: isBatting ? "700" : "500" 
        }}>
          {team}
          {isBatting && <span style={styles.liveDot} />}
        </span>
      </div>

      <div style={{
        ...styles.score,
        color: isBatting ? "var(--text)" : "var(--muted)"
      }}>
        {score || "--"}
      </div>
    </div>
  );
}

const styles = {
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    transition: "all 0.3s ease"
  },
  team: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  codeContainer: {
    background: "rgba(255,255,255,0.05)",
    width: "42px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    fontWeight: 800,
    fontSize: "11px",
    letterSpacing: "0.5px",
    color: "var(--text)"
  },
  teamName: {
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  score: {
    fontSize: "16px",
    fontWeight: 800,
    fontFamily: "monospace", // Keeps numbers aligned
  },
  liveDot: {
    width: "8px",
    height: "8px",
    background: "#16a34a",
    borderRadius: "50%",
    display: "inline-block",
    boxShadow: "0 0 8px #16a34a"
  }
};