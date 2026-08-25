import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">Admin Dashboard</h2>
      <nav>
        <ul>
          <li><Link to="/">Overview</Link></li>
          <li><Link to="/users">Users</Link></li>
          <li><Link to="/roles">Roles</Link></li>
          <li><Link to="/orders">Orders</Link></li>
          <li><Link to="/audit-log">Audit Log</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;