export default function Tabs({ activeTab, setActiveTab }) {
  const tabs = ["LIVE", "COMPLETED", "UPCOMING"];

  return (
    <div style={styles.tabsContainer}>
      <div style={styles.tabsWrapper}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.tab,
                color: isActive ? "#3b82f6" : "var(--muted)", // Blue for active
                fontWeight: isActive ? "700" : "500",
              }}
            >
              {tab}
              {/* This is the animated indicator line */}
              {isActive && <div style={styles.activeIndicator} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  tabsContainer: {
    background: "var(--card)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    position: "sticky", // Keeps the tabs at the top while scrolling
    top: 0,
    zIndex: 10,
    padding: "0 16px",
  },
  tabsWrapper: {
    display: "flex",
    justifyContent: "space-between", // Spreads tabs evenly
    maxWidth: "500px",
    margin: "0 auto",
  },
  tab: {
    background: "none",
    border: "none",
    padding: "16px 0",
    cursor: "pointer",
    fontSize: "13px",
    letterSpacing: "0.05em",
    position: "relative",
    flex: 1, // Makes each tab take equal width
    transition: "color 0.2s ease",
    outline: "none",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: "20%",
    right: "20%",
    height: "3px",
    background: "#3b82f6",
    borderRadius: "10px 10px 0 0",
    boxShadow: "0 -2px 10px rgba(59, 130, 246, 0.4)",
  },
};