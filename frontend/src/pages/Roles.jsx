import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

function Roles() {
  const [roles, setRoles] = useState([]);
  const [newRoleName, setNewRoleName] = useState("");
  const { token, user } = useAuth();
  const isAdmin = user?.role?.name === "Admin";

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    fetch("http://127.0.0.1:8000/roles/")
      .then((response) => response.json())
      .then((data) => setRoles(data));
  }

  function handleCreate(event) {
    event.preventDefault();
    if (!newRoleName.trim()) return;

    fetch("http://127.0.0.1:8000/roles/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newRoleName }),
    }).then(() => {
      setNewRoleName("");
      loadData();
    });
  }

  function handleEdit(role) {
    const newName = window.prompt("Enter new role name:", role.name);
    if (newName) {
      fetch(`http://127.0.0.1:8000/roles/${role.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName }),
      }).then(() => loadData());
    }
  }

  function handleDelete(roleId) {
    if (window.confirm("Are you sure you want to delete this role?")) {
      fetch(`http://127.0.0.1:8000/roles/${roleId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => loadData());
    }
  }

  return (
    <div>
      <h1>Roles</h1>

      {isAdmin && (
        <form className="add-role-form" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="New role name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
          />
          <button type="submit">Add Role</button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.name}</td>
              {isAdmin && (
                <td>
                  <button onClick={() => handleEdit(role)}>Edit</button>
                  <button onClick={() => handleDelete(role.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Roles;