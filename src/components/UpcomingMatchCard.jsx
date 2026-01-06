export default function UpcomingMatchCard({ match, onClick = () => {} }) {
  // Helper for cleaner date formatting
  const formatMatchDate = (dateStr) => {
    if (!dateStr) return "Date not announced";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div 
      style={styles.card} 
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.08)";
      }}
    >
      <div style={styles.header}>
        <span style={styles.badge}>UPCOMING</span>
        <span style={styles.formatBadge}>{match.matchType?.toUpperCase()}</span>
      </div>

      <h3 style={styles.title}>{match.name}</h3>
      
      <div style={styles.infoRow}>
        <span style={styles.muted}>📍 {match.venue}</span>
      </div>

      <div style={styles.date}>
        🗓️ {formatMatchDate(match.dateTime)}
      </div>

      {match.teams && match.teams.length === 2 && (
        <div style={styles.teams}>
          <div style={styles.teamBox}>{match.teams[0]}</div>
          <div style={styles.vs}>VS</div>
          <div style={styles.teamBox}>{match.teams[1]}</div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "var(--card)",
    color: "var(--text)",
    borderRadius: "14px",
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
    marginBottom: "12px"
  },
  badge: {
    background: "#3b82f6", // Blue for upcoming
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 700,
  },
  formatBadge: {
    fontSize: "12px",
    opacity: 0.6,
    fontWeight: 600,
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "19px",
    fontWeight: "700",
  },
  muted: {
    color: "var(--muted)",
    fontSize: "13px",
  },
  date: {
    marginTop: "12px",
    fontSize: "14px",
    fontWeight: "500",
    color: "var(--text)",
  },
  teams: {
    marginTop: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    padding: "10px",
    background: "rgba(0,0,0,0.03)",
    borderRadius: "8px"
  },
  teamBox: {
    flex: 1,
    textAlign: "center",
    fontWeight: 600,
    fontSize: "14px"
  },
  vs: {
    fontSize: "12px",
    opacity: 0.5,
    fontWeight: 700
  }
};