import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
// import "./CategoryPieChart.css";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#d0ed57"];

const CategoryPieChart = () => {
  const [month, setMonth] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const fetchCategoryData = async () => {
    if (!month) {
      setError("Please enter a valid month (1–12).");
      return;
    }

    try {
      setError("");
      const res = await fetch(`http://localhost:5000/a/category?month=${month}`);
      const result = await res.json();
      setData(result.filter(item => item.itemCount > 0)); // exclude 0-count
    } catch (err) {
      console.error("Error fetching category data:", err);
      setError("Failed to fetch data.");
    }
  };

  return (
    <div className="pie-container">
      <h2>Category Distribution (by Month)</h2>

      <div className="input-group">
        <input
          type="number"
          placeholder="Month (1-12)"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <button onClick={fetchCategoryData}>Show Pie Chart</button>
      </div>

      {error && <p className="error">{error}</p>}

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              dataKey="itemCount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p style={{ marginTop: "20px" }}>No data to display.</p>
      )}
    </div>
  );
};

export default CategoryPieChart;
