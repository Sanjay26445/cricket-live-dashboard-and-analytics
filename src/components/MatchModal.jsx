import { useEffect } from "react";
import ChasePressureMeter from "./ChasePressureMeter";
import WinProbabilityBar from "./WinProbabilityBar";
import { calculateCRR, calculateRRR } from "../utils/runRate";
import { calculateParScore } from "../utils/parScore";

export default function MatchModal({ match, onClose }) {
  if (!match) return null;

  /* ---------------- 1. DATA NORMALIZATION ---------------- */
  const getTeams = () => {
    if (match.teams && match.teams.length >= 2) return match.teams;
    if (match.t1 && match.t2) return [match.t1, match.t2];
    if (match.name && match.name.includes(" vs ")) {
      return match.name.split(" vs ").map(t => t.trim().replace(" (IPL)", ""));
    }
    return ["Team A", "Team B"];
  };

  const teams = getTeams();
  const rawScores = match.scores || 
                    match.score?.map(s => `${s.r}/${s.w} (${s.o} ov)`) || 
                    [];

  /* ---------------- 2. ANALYTICS HELPERS ---------------- */
  const parseScore = (scoreStr) => {
    if (!scoreStr || typeof scoreStr !== "string") return null;
    const m = scoreStr.match(/(\d+)\/(\d+)\s*\(([\d.]+)\s*ov\)/i);
    if (!m) return null;
    return { runs: Number(m[1]), wickets: Number(m[2]), overs: Number(m[3]) };
  };

  const isMatchEnded = match.matchEnded || 
                       match.status?.toLowerCase().includes("won by") || 
                       match.status?.toLowerCase().includes("tied");

  // FIX: Match has started if there are scores, regardless of the API flag
  const hasStarted = rawScores.length > 0 && rawScores[0] !== "DNB" && rawScores[0] !== "TBC";
  const isUpcoming = !hasStarted && !isMatchEnded;

  // Determine batting index (0 or 1)
  const battingIdx = (match.status?.toLowerCase().includes("need") || 
                      match.status?.toLowerCase().includes("target") || 
                      rawScores.length === 2) ? 1 : 0;

  const currentScoreData = parseScore(rawScores[battingIdx]);
  const firstInningsData = parseScore(rawScores[0]);
  
  // Use pre-calculated target or derive it
  const target = match.target || (firstInningsData ? firstInningsData.runs + 1 : null);

  // CRR/RRR Calculations
  const crr = (currentScoreData && currentScoreData.overs > 0) 
    ? calculateCRR({ runs: currentScoreData.runs, overs: currentScoreData.overs }) 
    : "0.00";

  const rrr = (battingIdx === 1 && target && currentScoreData && !isMatchEnded) 
    ? calculateRRR({ 
        runs: currentScoreData.runs, 
        overs: currentScoreData.overs, 
        target: target, 
        matchType: match.matchType 
      }) 
    : null;

  // DLS Par Score Calculation
  let parComparison = null;
  if (battingIdx === 1 && currentScoreData && target && !isMatchEnded) {
      parComparison = calculateParScore({
          runs: currentScoreData.runs,
          wickets: currentScoreData.wickets,
          overs: currentScoreData.overs,
          target: target,
          matchType: match.matchType
      });
  }

  /* ---------------- 3. WIN PROBABILITY MAPPING ---------------- */
  // We map 'batting' and 'bowling' probabilities to specific teams (Team 0 vs Team 1)
  // so the bar doesn't flip colors when innings change.
  const team0Prob = battingIdx === 0 ? match.winProb?.batting : match.winProb?.bowling;
  const team1Prob = battingIdx === 1 ? match.winProb?.batting : match.winProb?.bowling;

  /* ---------------- 4. LIFE CYCLE ---------------- */
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden"; 
    return () => {
      window.removeEventListener("keydown", esc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>

        <div style={styles.contentContainer}>
          {/* HEADER */}
          <div style={styles.header}>
            <h2 style={styles.title}>{match.name || `${teams[0]} vs ${teams[1]}`}</h2>
            <p style={styles.venue}>📍 {match.venue || "International Stadium"}</p>
          </div>

          {/* DYNAMIC SCOREBOARD */}
          <div style={styles.scoreboard}>
            {teams.map((team, idx) => (
              <div key={idx} style={styles.scoreRow}>
                <span style={{
                  ...styles.teamLabel, 
                  color: idx === battingIdx && !isUpcoming && !isMatchEnded ? "#22c55e" : "inherit"
                }}>
                  {team} {idx === battingIdx && !isUpcoming && !isMatchEnded && "•"}
                </span>
                <span style={styles.scoreValue}>
                  {rawScores[idx] || (isUpcoming ? "TBC" : "DNB")}
                </span>
              </div>
            ))}
          </div>

          {/* MATCH STATUS BOX */}
          <div style={{
            ...styles.statusBox,
            background: isUpcoming ? "rgba(59, 130, 246, 0.1)" : "rgba(34, 197, 94, 0.1)",
            color: isUpcoming ? "#3b82f6" : "#16a34a",
            border: isUpcoming ? "1px solid rgba(59, 130, 246, 0.2)" : "none"
          }}>
            {isUpcoming ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span>🕒</span> Match not started yet
              </div>
            ) : match.status}
          </div>

          {/* ANALYTICS GRID (CRR / RRR) */}
          {!isUpcoming && !isMatchEnded && (
            <div style={styles.analyticsGrid}>
              <div style={styles.anaBox}>
                <span style={styles.anaLabel}>CRR</span>
                <span style={styles.anaVal}>{crr}</span>
              </div>
              {rrr && (
                <div style={styles.anaBox}>
                  <span style={styles.anaLabel}>RRR</span>
                  <span style={{...styles.anaVal, color: '#f59e0b'}}>{rrr}</span>
                </div>
              )}
            </div>
          )}

          {/* WIN PROBABILITY BAR */}
          {!isUpcoming && !isMatchEnded && match.winProb && (
            <WinProbabilityBar 
              team0Prob={team0Prob} 
              team1Prob={team1Prob} 
              teams={teams} 
              isAhead={parComparison?.isAhead} 
            />
          )}

          {/* DLS PAR CARD */}
          {parComparison && !isMatchEnded && (
            <div style={{
              ...styles.parCard,
              borderLeft: `4px solid ${parComparison.isAhead ? "#16a34a" : "#dc2626"}`,
              borderColor: parComparison.isAhead ? "rgba(22,163,74,0.3)" : "rgba(220,38,38,0.3)"
            }}>
              <div style={styles.parHeader}>DLS Par Score</div>
              <div style={styles.parMain}>
                <span style={styles.parValue}>{parComparison.par}</span>
                <span style={{ ...styles.parStatus, color: parComparison.isAhead ? "#16a34a" : "#dc2626" }}>
                  ({parComparison.status})
                </span>
              </div>
            </div>
          )}

          {/* CHASE PRESSURE METER */}
          {match.chasePressure && !isMatchEnded && !isUpcoming && (
            <div style={styles.pressureArea}>
               <ChasePressureMeter data={match.chasePressure} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000, padding: "20px" },
  modal: { background: "var(--card)", color: "var(--text)", borderRadius: "24px", width: "100%", maxWidth: "400px", position: "relative", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", overflow: "hidden" },
  contentContainer: { padding: "24px", display: "flex", flexDirection: "column", gap: "16px" },
  closeBtn: { position: "absolute", top: 16, right: 16, border: "none", background: "rgba(255,255,255,0.1)", color: "var(--text)", cursor: "pointer", width: "32px", height: "32px", borderRadius: "50%", zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  header: { marginBottom: "4px" },
  title: { margin: 0, fontSize: "18px", fontWeight: "800", opacity: 0.9 },
  venue: { fontSize: "12px", opacity: 0.5, marginTop: "4px" },
  scoreboard: { background: "rgba(0,0,0,0.2)", borderRadius: "16px", padding: "14px", border: "1px solid rgba(255,255,255,0.05)" },
  scoreRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" },
  teamLabel: { fontSize: "13px", fontWeight: "700", opacity: 0.8 },
  scoreValue: { fontSize: "14px", fontWeight: "800", fontFamily: "monospace" },
  statusBox: { padding: "10px", borderRadius: "12px", textAlign: "center", fontWeight: "700", fontSize: "13px" },
  analyticsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  anaBox: { background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" },
  anaLabel: { fontSize: "10px", opacity: 0.5, fontWeight: "700", marginBottom: "4px", display: "block" },
  anaVal: { fontSize: "18px", fontWeight: "800" },
  parCard: { background: "rgba(0,0,0,0.15)", padding: "14px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" },
  parHeader: { fontSize: "10px", opacity: 0.5, marginBottom: "4px" },
  parMain: { display: "flex", alignItems: "baseline", gap: "8px" },
  parValue: { fontSize: "22px", fontWeight: "800" },
  parStatus: { fontSize: "12px", fontWeight: "600" },
  pressureArea: { marginTop: "4px" }
};