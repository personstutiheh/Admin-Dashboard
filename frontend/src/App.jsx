import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Overview from "./pages/Overview.jsx";
import Users from "./pages/Users.jsx";
import Roles from "./pages/Roles.jsx";
import AuditLog from "./pages/AuditLog.jsx";
import Login from "./pages/Login.jsx";
import Orders from "./pages/Orders.jsx";
import Signup from "./pages/Signup.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="app-layout">
                <Sidebar />
                <div className="main-content">
                  <Topbar />
                  <div className="page-content">
                    <Routes>
                      <Route path="/" element={<Overview />} />
                      <Route path="/users" element={<Users />} />
                      <Route path="/roles" element={<Roles />} />
                      <Route path="/audit-log" element={<AuditLog />} />
                      <Route path="/orders" element={<Orders />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;