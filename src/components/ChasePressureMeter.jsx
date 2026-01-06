export default function ChasePressureMeter({ data }) {
  if (!data) return null;

  // Calculate if the pressure is critically high (over 80%)
  const isCritical = data.difficulty > 80;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.labelText}>Chase Pressure</span>
        <span style={{ 
          ...styles.levelBadge, 
          color: data.color, 
          borderColor: data.color 
        }}>
          {data.level.toUpperCase()}
        </span>
      </div>

      <div style={styles.barWrap}>
        {/* The Pressure Fill */}
        <div
          style={{
            ...styles.bar,
            width: `${data.difficulty}%`,
            background: `linear-gradient(90deg, ${data.color}99, ${data.color})`,
            boxShadow: isCritical ? `0 0 12px ${data.color}66` : 'none',
          }}
        />
        {/* Subtle 50% Marker */}
        <div style={styles.marker} />
      </div>

      <div style={styles.labels}>
        <div style={styles.statGroup}>
          <span style={styles.bold}>RR {data.requiredRR}</span>
          <span style={styles.divider}>|</span>
          <span>{data.ballsLeft} balls</span>
        </div>
        <div style={styles.statGroup}>
          <span style={styles.wickets}>{data.wicketsLeft} wkts left</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: 20,
    padding: '12px',
    background: 'rgba(0,0,0,0.03)',
    borderRadius: '12px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  levelBadge: {
    fontSize: 10,
    fontWeight: '800',
    padding: '2px 8px',
    borderRadius: '4px',
    border: '1px solid',
  },
  barWrap: {
    height: 8,
    borderRadius: 4,
    background: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    position: 'relative',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  bar: {
    height: '100%',
    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  marker: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 1,
    background: 'rgba(255,255,255,0.2)',
  },
  labels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 12,
    marginTop: 10,
    color: 'var(--text)',
  },
  statGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    opacity: 0.9,
  },
  bold: {
    fontWeight: '700',
  },
  divider: {
    opacity: 0.3,
  },
  wickets: {
    fontWeight: '600',
    fontSize: 11,
  }
};