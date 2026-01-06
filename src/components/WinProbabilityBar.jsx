import React from 'react';

/**
 * WinProbabilityBar Component
 * Displays a dual-tone bar representing the win chances of two teams.
 * Now uses explicit team-indexed probabilities to prevent reversal.
 */
export default function WinProbabilityBar({ team0Prob, team1Prob, teams, isAhead }) {
  // FALLBACK: If teams data is missing, use placeholders
  const team1Name = teams?.[0] || "Team 1";
  const team2Name = teams?.[1] || "Team 2";

  return (
    <div style={styles.container}>
      {/* Team Labels Row */}
      <div style={styles.labelRow}>
        <div style={{ ...styles.teamInfo, textAlign: 'left' }}>
          <span style={{ ...styles.teamName, color: '#3b82f6' }}>{team1Name}</span>
          <span style={styles.probValue}>{team0Prob}%</span>
        </div>
        <div style={{ ...styles.teamInfo, textAlign: 'right' }}>
          <span style={styles.probValue}>{team1Prob}%</span>
          <span style={{ ...styles.teamName, color: '#f59e0b' }}>{team2Name}</span>
        </div>
      </div>
      
      {/* The Probability Bar */}
      <div style={styles.barContainer}>
        {/* Team 1 Fill (Blue) - Always Left */}
        <div 
          style={{ 
            ...styles.fill, 
            width: `${team0Prob}%`, 
            background: 'linear-gradient(90deg, #2563eb, #3b82f6)' 
          }} 
        />
        
        {/* Team 2 Fill (Amber) - Always Right */}
        <div 
          style={{ 
            ...styles.fill, 
            width: `${team1Prob}%`, 
            background: 'linear-gradient(90deg, #f59e0b, #d97706)' 
          }} 
        />
      </div>

      {/* Optional: Indicator text for DLS standing */}
      {isAhead && (
        <div style={styles.dlsIndicator}>
          ⭐ {team1Name} is currently ahead of DLS Par
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginTop: '12px',
    marginBottom: '8px',
    width: '100%'
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '6px'
  },
  teamInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  teamName: {
    fontSize: '11px',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  probValue: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--text, #fff)'
  },
  barContainer: {
    height: '10px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '5px',
    display: 'flex',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  fill: {
    height: '100%',
    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  dlsIndicator: {
    fontSize: '10px',
    color: '#22c55e',
    fontWeight: '700',
    marginTop: '6px',
    textAlign: 'center',
    textTransform: 'uppercase'
  }
};