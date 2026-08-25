import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("pending");
  const { token } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    fetch("http://127.0.0.1:8000/orders/")
      .then((response) => response.json())
      .then((data) => setOrders(data));
  }

  function handleCreate(event) {
    event.preventDefault();
    if (!customerName.trim() || !amount) return;

    fetch("http://127.0.0.1:8000/orders/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        customer_name: customerName,
        amount: parseFloat(amount),
        status: status,
      }),
    }).then(() => {
      setCustomerName("");
      setAmount("");
      setStatus("pending");
      loadData();
    });
  }

  return (
    <div>
      <h1>Orders</h1>

      <form className="add-order-form" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Customer name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button type="submit">Add Order</button>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer_name}</td>
              <td>${order.amount}</td>
              <td>{order.status}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;