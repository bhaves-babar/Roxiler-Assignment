import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#d0ed57", "#a4de6c", "#FF69B4", "#00C49F", "#FFBB28", "#FF8042"];

const CombinedDashboard = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const fetchCombinedData = async () => {
    setError("");
    setData(null);

    if (!month || !year) {
      setError("Please enter both month and year.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/a/combined?month=${month}&year=${year}`
      );
      const result = await response.json();

      if (result.error) {
        setError(result.error);
      } else {
        setData(result);
      }
    } catch (err) {
      setError("Failed to fetch combined data.");
      console.error(err);
    }
  };

  const getBarChartData = () => {
    return data
      ? Object.entries(data.priceRanges).map(([range, count]) => ({
          range,
          count,
        }))
      : [];
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "auto", padding: "20px" }}>
      <h2>Combined Analytics Dashboard</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="number"
          placeholder="Month (1–12)"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year (e.g. 2022)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <button onClick={fetchCombinedData}>Fetch Data</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <>
          {/* Stats Section */}
          <div style={{ marginBottom: "30px" }}>
            <h3>📊 Statistics</h3>
            <p><strong>Total Sale Amount:</strong> ${data.stats.totalSaleAmount}</p>
            <p><strong>Sold Items:</strong> {data.stats.totalSoldItems}</p>
            <p><strong>Not Sold Items:</strong> {data.stats.totalNotSoldItems}</p>
          </div>

          {/* Bar Chart for Price Ranges */}
          <div style={{ marginBottom: "40px" }}>
            <h3>📈 Price Range Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getBarChartData()}>
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart for Category */}
          <div>
            <h3>🥧 Category Distribution</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={data.categoryDistribution}
                  dataKey="itemCount"
                  nameKey="category"
                  outerRadius={120}
                  label
                >
                  {data.categoryDistribution.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default CombinedDashboard;
