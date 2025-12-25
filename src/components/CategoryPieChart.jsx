import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

// A brighter, neon-like palette for dark mode
const COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#ec4899", // Pink
];

const CategoryPieChart = ({ expenses = [] }) => {
  // 1. Aggregating data
  const categoryMap = {};

  expenses.forEach((exp) => {
    if (!exp.category) return;
    // Ensure amount is treated as a number
    categoryMap[exp.category] =
      (categoryMap[exp.category] || 0) + Number(exp.amount);
  });

  const data = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.customTooltip}>
          <p style={styles.tooltipLabel}>{payload[0].name}</p>
          <p style={styles.tooltipValue}>
            ₹{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.container}>
      {data.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={{ fontSize: "2rem", marginBottom: "10px" }}>📉</span>
          <p>No data to visualize yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60} // Makes it a Donut Chart
              outerRadius={80}
              paddingAngle={5} // Space between slices
              dataKey="value"
              stroke="none" // Removes the white outline
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "12px", color: "#cbd5e1" }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    height: "100%",
    minHeight: "250px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "0.9rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },

  customTooltip: {
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    backdropFilter: "blur(4px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "10px 15px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5)",
  },
  tooltipLabel: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "0.85rem",
  },
  tooltipValue: {
    margin: "4px 0 0 0",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1rem",
  },
};

export default CategoryPieChart;