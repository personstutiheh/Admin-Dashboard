import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const { token, user } = useAuth();
  const isAdmin = user?.role?.name === "Admin";

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    fetch("http://127.0.0.1:8000/users/")
      .then((response) => response.json())
      .then((data) => setUsers(data));

    fetch("http://127.0.0.1:8000/roles/")
      .then((response) => response.json())
      .then((data) => setRoles(data));
  }

  function getRoleName(roleId) {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : "Unknown";
  }

  function handleDeactivate(userId) {
    fetch(`http://127.0.0.1:8000/users/${userId}/deactivate`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => loadData());
  }

  function handleDelete(userId) {
    if (window.confirm("Are you sure you want to delete this user?")) {
      fetch(`http://127.0.0.1:8000/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => loadData());
    }
  }

  return (
    <div>
      <h1>Users</h1>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <span className={u.is_active ? "status-active" : "status-inactive"}>
                  {u.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td>{getRoleName(u.role_id)}</td>
              {isAdmin && (
                <td>
                  <button onClick={() => handleDeactivate(u.id)}>Deactivate</button>
                  <button onClick={() => handleDelete(u.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;