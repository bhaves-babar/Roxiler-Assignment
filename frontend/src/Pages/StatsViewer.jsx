import React, { useState } from "react";
// import "./StatsViewer.css";

const StatsViewer = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    if (!month || !year) {
      setError("Please enter both month and year.");
      setStats(null);
      return;
    }

    try {
      setError("");
      const res = await fetch(`http://localhost:5000/a/stats?month=${month}&year=${year}`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setError("Something went wrong while fetching data.");
    }
  };

  return (
    <div className="stats-container">
      <h2>Monthly Sales Statistics</h2>

      <div className="input-group">
        <input
          type="number"
          placeholder="Month (1-12)"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year (e.g. 2022)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <button onClick={fetchStats}>Get Stats</button>
      </div>

      {error && <p className="error">{error}</p>}

      {stats && (
        <div className="stats-result">
          <p><strong>Total Sale Amount:</strong> ${stats.totalSaleAmount}</p>
          <p><strong>Total Sold Items:</strong> {stats.totalSoldItems}</p>
          <p><strong>Total Not Sold Items:</strong> {stats.totalNotSoldItems}</p>
        </div>
      )}
    </div>
  );
};

export default StatsViewer;
