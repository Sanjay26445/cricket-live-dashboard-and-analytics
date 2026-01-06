export default function EmptyState({ message }) {
  return (
    <div style={styles.container}>
      <div style={styles.iconWrapper}>
        <span style={styles.icon}>🏏</span>
      </div>
      <h3 style={styles.message}>{message}</h3>
      <p style={styles.hint}>
        Matches will appear here as soon as they are available. 
        Try switching to **Demo Mode** in the header to see how it works!
      </p>
    </div>
  );
}

const styles = {
  container: {
    background: "var(--card)",
    color: "var(--text)",
    padding: "48px 24px",
    borderRadius: "20px",
    textAlign: "center",
    marginTop: "20px",
    border: "2px dashed var(--border)", // Dotted border indicates a placeholder
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  iconWrapper: {
    width: "60px",
    height: "60px",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px",
  },
  icon: {
    fontSize: "32px",
  },
  message: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--text)",
  },
  hint: {
    margin: 0,
    fontSize: "13px",
    color: "var(--muted)",
    maxWidth: "280px",
    lineHeight: "1.5",
  },
};