// src/pages/CreateDeliveryPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface NewDelivery {
  customerId: string;
  address: string;
  status: "Assigned" | "Pending" | "In Transit" | "Delivered";
}

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function CreateDeliveryPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<NewDelivery>({
    customerId: "",
    address: "",
    status: "Assigned",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.customerId || !form.address) {
      setError("All fields are required.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/delivery`, {
        customerId: form.customerId,
        address: form.address,
        status: form.status,
      });
      setSuccess("✅ Delivery created successfully!");
      // after 1.5s, redirect to dashboard
      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      console.error("❌ Error creating delivery:", err);
      setError("Failed to create delivery.");
    }
  };

  return (
    <div style={container}>
      <header style={header}>
        <h1 style={headerTitle}>📦 Create Delivery</h1>
      </header>

      <main style={main}>
        <div style={card}>
          {error && (
            <p style={{ color: "#d32f2f", marginBottom: 12 }}>{error}</p>
          )}
          {success && (
            <p style={{ color: "#388e3c", marginBottom: 12 }}>{success}</p>
          )}

          <form onSubmit={handleSubmit} style={formStyle}>
            <input
              name="customerId"
              placeholder="Customer ID"
              value={form.customerId}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
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
                Create Delivery
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

// --- Layout Styles ---
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
};
const footer: React.CSSProperties = {
  background: "#e1f5fe",
  padding: "12px 0",
  textAlign: "center",
};

// --- Card & Form Styles ---
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

// --- Button Styles ---
const btnGroup: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  marginTop: "16px",
};
const btnBase: React.CSSProperties = {
  flex: 1,
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
};
const btnSecondary: React.CSSProperties = {
  ...btnBase,
  background: "#6c757d",
  color: "#fff",
};
