// src/pages/DeliveryDashboardPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Delivery {
  _id: string;
  customerId: string;
  status: string;
}

export default function DeliveryDashboardPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<Delivery[]>("http://localhost:5000/api/delivery")
      .then((res) => setDeliveries(res.data))
      .catch(() => alert("❌ Failed to fetch deliveries"));
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this delivery?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/delivery/${id}`);
      setDeliveries((prev) => prev.filter((d) => d._id !== id));
    } catch {
      alert("❌ Failed to delete delivery");
    }
  };

  const filtered = deliveries.filter(
    (d) =>
      d.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={container}>
      <header style={header}>
        <h2 style={{ margin: 0, color: "#01579b" }}> 🚚 Delivery Dashboard</h2>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button style={btn} onClick={() => navigate("/create")}>
            + New Delivery
          </button>
          <button style={btn} onClick={() => navigate("/add-driver")}>
            + Add Driver
          </button>
          <button style={btn} onClick={() => navigate("/drivers")}>
            View Drivers
          </button>
          <button style={btn} onClick={() => navigate("/analytics")}>
            📈 Analytics
          </button>
        </div>
      </header>

      <main style={main}>
        <input
          type="text"
          placeholder="Search…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={shortSearch}
        />

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Customer ID</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d._id}>
                <td style={td}>{d.customerId}</td>
                <td style={td}>{d.status}</td>
                <td style={td}>
                  <button style={actionBtn} onClick={() => navigate(`/delivery/${d._id}`)}>
                    View
                  </button>
                  <button style={editBtn} onClick={() => navigate(`/edit-delivery/${d._id}`)}>
                    Edit
                  </button>
                  <button style={deleteBtn} onClick={() => handleDelete(d._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <footer style={footer}>
        <span>© 2025 Delivery Dashboard</span>
      </footer>
    </div>
  );
}

// layout
const container: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
};
const header: React.CSSProperties = {
  background: "#e1f5fe",
  padding: "12px 20px",
  display: "flex",
  alignItems: "center",
  gap: 12,
};
const main: React.CSSProperties = {
  flex: 1,
  padding: 20,
  background: "#fafafa",
};
const footer: React.CSSProperties = {
  background: "#e1f5fe",
  padding: "12px 20px",
  textAlign: "center",
};

// table styling
const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 16,
};
const th: React.CSSProperties = {
  borderBottom: "2px solid #bbb",
  padding: "8px",
  textAlign: "left",
};
const td: React.CSSProperties = {
  borderBottom: "1px solid #ddd",
  padding: "8px",
};

// search
const shortSearch: React.CSSProperties = {
  width: "300px",
  padding: "8px",
  borderRadius: 4,
  border: "1px solid #ccc",
};

// buttons
const btn: React.CSSProperties = {
  padding: "8px 12px",
  background: "#0288d1",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};
const actionBtn: React.CSSProperties = {
  ...btn,
  marginRight: 6,
  padding: "4px 8px",
  fontSize: "0.9em",
};
const editBtn: React.CSSProperties = {
  ...actionBtn,
  background: "#ffc107",
  color: "#000",
};
const deleteBtn: React.CSSProperties = {
  ...actionBtn,
  background: "#dc3545",
};
