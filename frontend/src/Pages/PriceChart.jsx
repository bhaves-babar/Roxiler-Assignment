import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
// import "./PriceChart.css";

const PriceChart = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState("");

  const fetchPriceData = async () => {
    if (!month || !year) {
      setError("Please enter both month and year.");
      setChartData([]);
      return;
    }

    try {
      setError("");
      const res = await fetch(`http://localhost:5000/a/price?month=${month}&year=${year}`);
      const data = await res.json();

      const formattedData = Object.entries(data.priceRanges).map(([range, count]) => ({
        range,
        count,
      }));

      setChartData(formattedData);
    } catch (err) {
      console.error("Failed to fetch price data:", err);
      setError("Something went wrong while fetching chart data.");
    }
  };

  return (
    <div className="chart-container">
      <h2>Price Range Chart</h2>

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
        <button onClick={fetchPriceData}>Show Chart</button>
      </div>

      {error && <p className="error">{error}</p>}

      {chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PriceChart;
