import { useState, useEffect } from "react";

function AuditLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/audit-logs/")
      .then((response) => response.json())
      .then((data) => setLogs(data));
  }, []);

  return (
    <div>
      <h1>Audit Log</h1>
      <table className="data-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User ID</th>
            <th>Action</th>
            <th>Resource</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.user_id ?? "Deleted user"}</td>
              <td>{log.action}</td>
              <td>{log.resource}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AuditLog;