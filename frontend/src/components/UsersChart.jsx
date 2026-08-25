import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function UsersChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/overview/users-over-time")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  if (data.length === 0) {
    return <p>No user data yet.</p>;
  }

  return (
    <div className="chart-card">
      <h2>New Users Over Time</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="user_count" fill="#333" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default UsersChart;