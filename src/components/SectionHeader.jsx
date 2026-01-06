export default function SectionHeader({ title, count, type = "live" }) {
  if (!title) return null;

  const isLive = title.toLowerCase().includes("live") || type === "live";

  return (
    <div style={styles.wrap}>
      <h3 style={styles.title}>{title}</h3>
      
      {count !== undefined && count > 0 && (
        <div style={{
          ...styles.badge,
          background: isLive ? "rgba(220, 38, 38, 0.1)" : "rgba(255, 255, 255, 0.05)",
          color: isLive ? "#ef4444" : "var(--muted)"
        }}>
          {isLive && <span style={styles.pulse} />}
          {count} {isLive ? "LIVE" : "MATCHES"}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 4px",
    marginBottom: "20px",
    marginTop: "10px",
  },
  title: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "var(--muted)",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "800",
    border: "1px solid rgba(255,255,255,0.05)"
  },
  pulse: {
    width: "6px",
    height: "6px",
    background: "#ef4444",
    borderRadius: "50%",
    boxShadow: "0 0 0 rgba(239, 68, 68, 0.4)",
    animation: "pulse-animation 2s infinite",
  }
};