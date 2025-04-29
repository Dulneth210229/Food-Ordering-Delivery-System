// src/pages/EditDeliveryPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface DeliveryForm {
  customerId: string;
  address: string;
  status: "Assigned" | "Pending" | "In Transit" | "Delivered";
}

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function EditDeliveryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<DeliveryForm>({
    customerId: "",
    address: "",
    status: "Assigned",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>("");

  // 1️⃣ Load existing delivery
  useEffect(() => {
    if (!id) return;
    axios.get<DeliveryForm>(`${API_BASE_URL}/api/delivery/${id}`)
      .then((res) => setForm(res.data))
      .catch((err) => {
        console.error("❌ Error loading delivery:", err);
        setMessage("Failed to load delivery.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/delivery/${id}`, form);
      setMessage("Delivery updated successfully!");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      console.error("❌ Error updating delivery:", err);
      setMessage("Failed to update delivery.");
    }
  };

  if (loading) return <div style={loadingStyle}>Loading…</div>;

  return (
    <div style={container}>
      <header style={header}>
        <h1 style={headerTitle}>✏️ Edit Delivery</h1>
      </header>

      <main style={main}>
        <div style={card}>
          {message && (
            <p style={{ color: message.startsWith("Failed") ? "#d32f2f" : "#388e3c" }}>
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit} style={formStyle}>
            <input
              type="text"
              name="customerId"
              placeholder="Customer ID"
              value={form.customerId}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="text"
              name="address"
              placeholder="Delivery Address"
              value={form.address}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option>Assigned</option>
              <option>Pending</option>
              <option>In Transit</option>
              <option>Delivered</option>
            </select>

            <div style={btnGroup}>
              <button type="submit" style={btnPrimary}>
                Update
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                style={btnSecondary}
              >
                ← Back to Dashboard
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer style={footer}>© 2025 Delivery Dashboard</footer>
    </div>
  );
}

// --- Shared layout styles ---
const container: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  fontFamily: "Arial, sans-serif",
};

const header: React.CSSProperties = {
  background: "#e1f5fe",
  padding: "16px 24px",
  textAlign: "center",
};

const headerTitle: React.CSSProperties = {
  margin: 0,
  color: "#01579b",
  fontSize: "1.8rem",
};

const main: React.CSSProperties = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#fafafa",
  padding: "20px",
};

const footer: React.CSSProperties = {
  background: "#e1f5fe",
  padding: "12px 0",
  textAlign: "center",
};

// --- Card & form styles ---
const card: React.CSSProperties = {
  background: "#fff",
  padding: "24px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  maxWidth: "400px",
  width: "100%",
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const inputStyle: React.CSSProperties = {
  marginBottom: "12px",
  padding: "10px",
  fontSize: "1rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

// --- Button styles ---
const btnGroup: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "16px",
};

const btnBase: React.CSSProperties = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "0.95rem",
};

const btnPrimary: React.CSSProperties = {
  ...btnBase,
  background: "#0288d1",
  color: "#fff",
  flex: 1,
  marginRight: "8px",
};

const btnSecondary: React.CSSProperties = {
  ...btnBase,
  background: "#6c757d",
  color: "#fff",
  flex: 1,
};

const loadingStyle: React.CSSProperties = {
  padding: "40px",
  textAlign: "center",
  fontSize: "1.2rem",
};
