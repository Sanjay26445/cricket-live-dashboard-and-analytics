import { useEffect, useState } from "react";

// Components
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import SectionHeader from "./components/SectionHeader";
import LiveMatchCard from "./components/LiveMatchCard";
import CompletedMatchCard from "./components/CompletedMatchCard";
import UpcomingMatchCard from "./components/UpcomingMatchCard";
import MatchModal from "./components/MatchModal";
import EmptyState from "./components/EmptyState";

// Utils
import { calculateWinProbability } from "./utils/winProbability";
import { calculateChaseDifficulty } from "./utils/chaseDifficulty";

// Data
import demoMatches from "./data/mockMatches";

const API_URL = "https://api.cricapi.com/v1/currentMatches";

export default function App() {
  /* ---------------- STATE ---------------- */
  const [mode, setMode] = useState("LIVE"); 
  const [activeTab, setActiveTab] = useState("LIVE");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [liveMatches, setLiveMatches] = useState([]);
  const [completedMatches, setCompletedMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [error, setError] = useState("");

  /* ---------------- THEME ---------------- */
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* ---------------- CORE DATA FETCHING ---------------- */
  const fetchMatches = async () => {
    try {
      const apiKey = import.meta.env.VITE_CRICAPI_KEY;
      if (!apiKey) {
        setError("API Key missing. Check .env file.");
        return;
      }

      const res = await fetch(`${API_URL}?apikey=${apiKey}&offset=0`);
      const json = await res.json();

      if (!json?.data || json.status === "failure") {
        throw new Error("API Limit reached or service unavailable.");
      }

      const live = [];
      const upcoming = [];
      const completed = [];

      json.data.forEach((m) => {
        // 1. Filter Upcoming
        if (!m.matchStarted) {
          upcoming.push(m);
          return;
        }
        
        // 2. Filter Completed
        if (m.matchEnded) {
          completed.push({
            ...m,
            scores: m.score?.map(s => `${s.r}/${s.w} (${s.o} ov)`) || ["Match Finished"]
          });
          return;
        }

        // 3. Process Live Match Data
        const scores = m.score?.map(s => `${s.r}/${s.w} (${s.o} ov)`) || ["--", "--"];
        const lastScoreEntry = m.score?.[m.score.length - 1];
        
        if (!lastScoreEntry) return;

        // Determine target for 2nd innings
        const target = m.score.length > 1 ? m.score[0].r + 1 : null;

        // Calculate Analytics
        const winProb = calculateWinProbability({
          runs: lastScoreEntry.r,
          wickets: lastScoreEntry.w,
          overs: lastScoreEntry.o,
          target,
          matchType: m.matchType
        });

        const chasePressure = target ? calculateChaseDifficulty({
          runs: lastScoreEntry.r,
          wickets: lastScoreEntry.w,
          overs: lastScoreEntry.o,
          target,
          matchType: m.matchType,
        }) : null;

        live.push({ 
          ...m, 
          scores, 
          winProb, 
          target, 
          chasePressure 
        });
      });

      setLiveMatches(live);
      setUpcomingMatches(upcoming);
      setCompletedMatches(completed);
      setLastUpdated(new Date());
      setError("");
    } catch (err) {
      setError("Live API is currently unavailable.");
      setLiveMatches([]); 
    }
  };

  /* ---------------- DEMO LOGIC ---------------- */
  const switchToDemo = () => {
    const processedLive = demoMatches.live.map((m) => {
      const winProb = calculateWinProbability({
        runs: m.runs,
        wickets: m.wickets,
        overs: m.overs,
        target: m.target,
        matchType: m.matchType
      });

      const chasePressure = m.target ? calculateChaseDifficulty({
        runs: m.runs,
        wickets: m.wickets,
        overs: m.overs,
        target: m.target,
        matchType: m.matchType,
      }) : null;

      return { 
        ...m, 
        winProb, 
        chasePressure,
        scores: m.scores || [`${m.runs}/${m.wickets} (${m.overs} ov)`, "DNB"]
      };
    });

    setLiveMatches(processedLive);
    setCompletedMatches(demoMatches.completed);
    setUpcomingMatches(demoMatches.upcoming);
    setLastUpdated(new Date());
    setError(""); 
  };

  /* ---------------- MODE & SYNC HANDLER ---------------- */
  useEffect(() => {
    if (mode === "LIVE") {
      fetchMatches();
      const interval = setInterval(fetchMatches, 60000);
      return () => clearInterval(interval);
    } else {
      switchToDemo();
    }
  }, [mode]);

  // Sync Modal if background data refreshes
  useEffect(() => {
    if (selectedMatch) {
      const updated = liveMatches.find(m => m.id === selectedMatch.id);
      if (updated) setSelectedMatch(updated);
    }
  }, [liveMatches]);

  return (
    <div className="app-root hide-scrollbar">
      <Header 
        mode={mode} 
        setMode={setMode} 
        theme={theme} 
        setTheme={setTheme} 
        lastUpdated={lastUpdated} 
      />
      
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="container" style={styles.main}>
        {error && mode === "LIVE" && (
          <div style={styles.errorBanner}>
            ⚠️ {error} Switch to <strong>DEMO</strong> mode to see analytics.
          </div>
        )}

        {activeTab === "LIVE" && (
          <>
            <SectionHeader title="Live Matches" count={liveMatches.length} type="live" />
            {liveMatches.length === 0 ? (
              <EmptyState message={mode === "LIVE" ? "No matches available from the API." : "Loading..."} />
            ) : (
              liveMatches.map((m) => (
                <LiveMatchCard 
                  key={m.id} 
                  match={m} 
                  onClick={() => setSelectedMatch(m)} 
                />
              ))
            )}
          </>
        )}

        {activeTab === "COMPLETED" && (
          <>
            <SectionHeader title="Recent Results" count={completedMatches.length} type="completed" />
            {completedMatches.length === 0 ? (
              <EmptyState message="No completed matches to display." />
            ) : (
              completedMatches.map((m) => (
                <CompletedMatchCard key={m.id} match={m} onClick={() => setSelectedMatch(m)} />
              ))
            )}
          </>
        )}

        {activeTab === "UPCOMING" && (
          <>
            <SectionHeader title="Schedule" count={upcomingMatches.length} type="upcoming" />
            {upcomingMatches.length === 0 ? (
              <EmptyState message="No upcoming matches scheduled." />
            ) : (
              upcomingMatches.map((m) => (
                <UpcomingMatchCard key={m.id} match={m} onClick={() => setSelectedMatch(m)} />
              ))
            )}
          </>
        )}
      </main>

      {selectedMatch && (
        <MatchModal 
          match={selectedMatch} 
          onClose={() => setSelectedMatch(null)} 
        />
      )}
    </div>
  );
}

const styles = {
  main: { 
    maxWidth: "800px", 
    margin: "24px auto", 
    padding: "0 16px", 
    color: "var(--text)", 
    minHeight: "70vh" 
  },
  errorBanner: { 
    background: 'rgba(239, 68, 68, 0.1)', 
    color: '#ef4444', 
    padding: '12px', 
    borderRadius: '12px', 
    marginBottom: '20px', 
    fontSize: '13px', 
    textAlign: 'center',
    fontWeight: '600', 
    border: '1px solid rgba(239, 68, 68, 0.2)' 
  }
};