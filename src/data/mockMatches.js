export default {
  live: [
    {
      id: "d1",
      name: "India vs Australia",
      venue: "Wankhede Stadium",
      matchType: "odi",
      teams: ["Australia", "India"],
      scores: ["311/7 (50.0 ov)", "278/5 (44.3 ov)"],
      status: "India need 34 runs in 33 balls",
      balls: ["1", "4", "0", "6", "2", "1"],
      // Numeric Fields for Calculation
      runs: 278,
      wickets: 5,
      overs: 44.3,
      target: 312,
      // REMOVED: winProb - will be calculated by App.jsx
      chasePressure: {
        difficulty: 32,
        level: "Comfortable",
        color: "#16a34a",
        requiredRR: "6.2",
        ballsLeft: 33,
        wicketsLeft: 5,
      },
    },
    {
      id: "d2",
      name: "England vs Pakistan",
      venue: "Lord's",
      matchType: "t20",
      teams: ["England", "Pakistan"],
      scores: ["164/6 (20 ov)", "112/4 (14.1 ov)"],
      status: "Pakistan need 53 runs in 35 balls",
      balls: ["4", "1", "1", "0", "W", "2"],
      // Numeric Fields for Calculation
      runs: 112,
      wickets: 4,
      overs: 14.1,
      target: 165,
      // REMOVED: winProb - will be calculated by App.jsx
      chasePressure: {
        difficulty: 55,
        level: "Tight",
        color: "#f59e0b",
        requiredRR: "9.1",
        ballsLeft: 35,
        wicketsLeft: 6,
      },
    },
    {
      id: "d4",
      name: "West Indies vs Bangladesh",
      venue: "Barbados",
      matchType: "t20",
      teams: ["West Indies", "Bangladesh"],
      scores: ["185/4 (20 ov)", "171/8 (19.1 ov)"],
      status: "Bangladesh need 15 runs in 5 balls",
      balls: ["W", "0", "6", "1", "W", "0"], 
      // Numeric Fields for Calculation
      runs: 171,
      wickets: 8,
      overs: 19.1,
      target: 186,
      // REMOVED: winProb - will be calculated by App.jsx
      chasePressure: {
        difficulty: 94,
        level: "Extreme",
        color: "#dc2626",
        requiredRR: "18.0",
        ballsLeft: 5,
        wicketsLeft: 2,
      },
    },
    {
      id: "d3",
      name: "South Africa vs New Zealand",
      venue: "Centurion",
      matchType: "t20",
      teams: ["South Africa", "New Zealand"],
      scores: ["180/4 (19 ov)", "--"],
      status: "South Africa batting (Innings 1)",
      balls: ["6", "4", "1", "0", "W", "2"],
      // Numeric Fields for Calculation (First Innings)
      runs: 180,
      wickets: 4,
      overs: 19.0,
      target: null, // First innings indicator
      // REMOVED: winProb - will be calculated by App.jsx
      chasePressure: null, 
    },
  ],

  completed: [
    {
      id: "c1",
      name: "India vs Sri Lanka",
      venue: "Colombo",
      scores: ["312/7 (50 ov)", "286/10 (48.2 ov)"],
      status: "India won by 26 runs",
    },
    {
      id: "c2",
      name: "Australia vs Afghanistan",
      venue: "Perth",
      scores: ["201/10 (45.3 ov)", "202/3 (38.1 ov)"],
      status: "Afghanistan won by 7 wickets",
    },
    {
      id: "c3",
      name: "MI vs RCB (IPL)",
      venue: "Mumbai",
      scores: ["192/5 (20 ov)", "192/8 (20 ov)"],
      status: "Match Tied (MI won Super Over)",
    },
    {
      id: "c4",
      name: "England vs New Zealand",
      venue: "Old Trafford",
      scores: ["155/9 (20 ov)", "158/2 (17.4 ov)"],
      status: "New Zealand won by 8 wickets",
    },
  ],

  upcoming: [
    {
      id: "u1",
      name: "Australia vs England",
      venue: "MCG",
      teams: ["Australia", "England"],
      dateTime: "2026-01-05T09:00:00",
      matchType: "odi",
    },
    {
      id: "u2",
      name: "India vs Pakistan",
      venue: "Ahmedabad",
      teams: ["India", "Pakistan"],
      dateTime: "2026-02-14T14:30:00",
      matchType: "t20",
    },
    {
      id: "u3",
      name: "CSK vs KKR",
      venue: "Chennai",
      teams: ["CSK", "KKR"],
      dateTime: "2026-03-22T19:30:00",
      matchType: "t20",
    },
    {
      id: "u4",
      name: "South Africa vs India",
      venue: "Johannesburg",
      teams: ["South Africa", "India"],
      dateTime: "2026-04-01T17:00:00",
      matchType: "odi",
    },
  ],
};