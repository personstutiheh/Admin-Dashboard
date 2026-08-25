import { useState, useEffect } from "react";

function StatCards() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/overview/")
      .then((response) => response.json())
      .then((data) => setOverview(data));
  }, []);

  if (!overview) {
    return <p>Loading...</p>;
  }

  return (
    <div className="stat-cards">
      <div className="stat-card">
        <p className="stat-label">Total Users</p>
        <p className="stat-value">{overview.total_users}</p>
      </div>
      <div className="stat-card">
        <p className="stat-label">Total Orders</p>
        <p className="stat-value">{overview.total_orders}</p>
      </div>
      <div className="stat-card">
        <p className="stat-label">Revenue</p>
        <p className="stat-value">${overview.total_revenue}</p>
      </div>
      <div className="stat-card">
        <p className="stat-label">Growth</p>
        <p className="stat-value">{overview.growth_percent}%</p>
      </div>
    </div>
  );
}

export default StatCards;