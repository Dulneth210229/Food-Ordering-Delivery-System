// src/pages/DriverListPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

interface Driver {
  _id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  status: string;
  address?: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function DriverListPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<Driver[]>(`${API_BASE_URL}/api/drivers`)
      .then((res) => setDrivers(res.data))
      .catch(() => setError("❌ Failed to fetch drivers"));
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this driver?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/drivers/${id}`);
      setDrivers((prev) => prev.filter((d) => d._id !== id));
    } catch {
      alert("❌ Failed to delete driver");
    }
  };

  const filtered = drivers.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={container}>
      <header style={header}>
        <h1 style={headerTitle}>🚚 Driver List</h1>
        <div>
          <Link to="/add-driver" style={headerBtn}>+ Add Driver</Link>
          <Link to="/" style={headerBtn}>← Dashboard</Link>
        </div>
      </header>

      <main style={main}>
        <div style={card}>
          {error && <p style={errorMsg}>{error}</p>}

          <input
            type="text"
            placeholder="Search by name or email…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInput}
          />

          <table style={table}>
            <thead>
              <tr>
                <th style={th}>ID</th>
                <th style={th}>Name</th>
                <th style={th}>Email</th>
                <th style={th}>Phone</th>
                <th style={th}>License</th>
                <th style={th}>Status</th>
                <th style={th}>Address</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d._id}>
                  <td style={td}>{d._id}</td>
                  <td style={td}>{d.name}</td>
                  <td style={td}>{d.email}</td>
                  <td style={td}>{d.phone}</td>
                  <td style={td}>{d.licenseNumber}</td>
                  <td style={td}>{d.status}</td>
                  <td style={td}>{d.address ?? "–"}</td>
                  <td style={td}>
                    <button
                      style={editBtn}
                      onClick={() => navigate(`/edit-driver/${d._id}`)}
                    >
                      ✏️
                    </button>
                    <button
                      style={deleteBtn}
                      onClick={() => handleDelete(d._id)}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <footer style={footer}>© 2025 Delivery Dashboard</footer>
    </div>
  );
}

// --- Layout ---
const container: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  fontFamily: "Arial, sans-serif",
};

const header: React.CSSProperties = {
  background: "#e1f5fe",
  padding: "16px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const headerTitle: React.CSSProperties = {
  margin: 0,
  color: "#01579b",
};

const headerBtn: React.CSSProperties = {
  marginLeft: "8px",
  padding: "8px 12px",
  background: "#0288d1",
  color: "#fff",
  textDecoration: "none",
  borderRadius: "4px",
};

const main: React.CSSProperties = {
  flex: 1,
  background: "#fafafa",
  padding: "20px",
  display: "flex",
  justifyContent: "center",
};

const card: React.CSSProperties = {
  width: "100%",
  maxWidth: "1000px",
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const footer: React.CSSProperties = {
  background: "#e1f5fe",
  padding: "12px 0",
  textAlign: "center",
};

const errorMsg: React.CSSProperties = {
  color: "#d32f2f",
  marginBottom: "12px",
};

const searchInput: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginBottom: "16px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const th: React.CSSProperties = {
  borderBottom: "2px solid #bbb",
  padding: "8px",
  textAlign: "left",
  background: "#f0f0f0",
};

const td: React.CSSProperties = {
  borderBottom: "1px solid #ddd",
  padding: "8px",
};

const editBtn: React.CSSProperties = {
  marginRight: "6px",
  padding: "4px 8px",
  background: "#ffc107",
  color: "#000",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const deleteBtn: React.CSSProperties = {
  padding: "4px 8px",
  background: "#dc3545",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
