export default function RecentBalls({ balls }) {
  if (!balls || balls.length === 0) {
    return (
      <div style={styles.waiting}>
        <span style={styles.pulseDot} />
        Waiting for next delivery...
      </div>
    );
  }

  return (
    <div>
      <div style={styles.container}>
        {balls.map((b, i) => (
          <div 
            key={`${i}-${b}`} 
            style={{
              ...styles.ballBase,
              ...getBallVariant(b)
            }}
          >
            {b}
          </div>
        ))}
      </div>
      <div style={styles.footer}>Recent Deliveries</div>
    </div>
  );
}

/* ---------- STYLING LOGIC ---------- */

function getBallVariant(b) {
  switch (b) {
    case "6":
      return { background: "#dc2626", color: "#fff", transform: "scale(1.1)", boxShadow: "0 0 8px rgba(220, 38, 38, 0.4)" };
    case "4":
      return { background: "#2563eb", color: "#fff" };
    case "W":
      return { background: "#000", color: "#fff", fontWeight: "800" };
    case "0":
      return { background: "rgba(255,255,255,0.05)", color: "var(--muted)", border: "1px solid rgba(255,255,255,0.1)" };
    default:
      return { background: "var(--card-light, #f3f4f6)", color: "var(--text)" };
  }
}

const styles = {
  container: {
    display: "flex", 
    gap: "8px",
    alignItems: "center",
    padding: "4px 0"
  },
  ballBase: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 700,
    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    animation: "ball-pop 0.4s ease-out",
  },
  waiting: {
    fontSize: "12px", 
    color: "var(--muted)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontStyle: "italic"
  },
  pulseDot: {
    width: "6px",
    height: "6px",
    background: "#16a34a",
    borderRadius: "50%",
    animation: "pulse 1.5s infinite"
  },
  footer: {
    fontSize: "10px", 
    color: "var(--muted)", 
    marginTop: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  }
};