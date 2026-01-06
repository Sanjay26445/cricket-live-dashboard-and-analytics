export default function Header({ mode, setMode, lastUpdated, theme, setTheme }) {
  const isDark = theme === "dark";

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <div style={styles.brand}>
          <span style={styles.logo}>🏏</span>
          <h2 style={styles.title}>Cricket Live Score And Analytics</h2>
        </div>
        {lastUpdated && (
          <div style={styles.statusRow}>
            <span style={styles.pulseDot} />
            <span style={styles.time}>
              Synced: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        )}
      </div>

      <div style={styles.right}>
        {/* THEME TOGGLE (IconButton style) */}
        <button
          style={styles.iconBtn}
          onClick={() => setTheme(isDark ? "light" : "dark")}
          title="Toggle Theme"
        >
          {isDark ? "🔆" : "🌙"}
        </button>

        {/* MODE SWITCHER (Segmented Control) */}
        <div style={styles.segmentedControl}>
          <button
            onClick={() => setMode("LIVE")}
            style={{
              ...styles.modeTab,
              ...(mode === "LIVE" ? styles.activeTab : {})
            }}
          >
            Live
          </button>
          <button
            onClick={() => setMode("DEMO")}
            style={{
              ...styles.modeTab,
              ...(mode === "DEMO" ? styles.activeTab : {})
            }}
          >
            Demo
          </button>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    background: "var(--card)",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid var(--border)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(8px)", // Nice effect for dark mode
  },
  left: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  logo: {
    fontSize: "20px",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "800",
    color: "var(--text)",
    letterSpacing: "-0.5px",
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  pulseDot: {
    width: "6px",
    height: "6px",
    background: "#22c55e",
    borderRadius: "50%",
    boxShadow: "0 0 8px #22c55e",
  },
  time: {
    fontSize: "10px",
    color: "var(--muted)",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  right: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  iconBtn: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "16px",
  },
  segmentedControl: {
    display: "flex",
    background: "rgba(0,0,0,0.1)",
    padding: "3px",
    borderRadius: "10px",
    border: "1px solid var(--border)",
  },
  modeTab: {
    padding: "6px 14px",
    border: "none",
    background: "transparent",
    color: "var(--muted)",
    fontSize: "12px",
    fontWeight: "600",
    borderRadius: "7px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  activeTab: {
    background: "var(--card)",
    color: "var(--text)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
};