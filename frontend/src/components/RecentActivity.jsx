import { useState, useEffect } from "react";

function RecentActivity() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/audit-logs/")
      .then((response) => response.json())
      .then((data) => setLogs(data.slice(0, 5)));
  }, []);

  return (
    <div className="activity-panel">
      <h2>Recent Activity</h2>
      {logs.length === 0 ? (
        <p>No recent activity.</p>
      ) : (
        <ul>
          {logs.map((log) => (
            <li key={log.id}>
              <strong>{log.action}</strong> on {log.resource}
              <span className="activity-time">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecentActivity;