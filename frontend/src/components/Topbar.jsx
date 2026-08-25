import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Topbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="topbar">
      <input type="text" placeholder="Search..." className="search-bar" />
      <div className="topbar-right">
        <span>🔔</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
        <span className="avatar"></span>
      </div>
    </div>
  );
}

export default Topbar;