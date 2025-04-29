// src/pages/AddDriverPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface DriverForm {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  address: string;
  status: string;
  isAvailable: boolean;
  currentOrders: number;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function AddDriverPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<DriverForm>({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
    address: "",
    status: "active",
    isAvailable: true,
    currentOrders: 0,
  });
  const [message, setMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "currentOrders" ? Number(value) : value,
    }));
  };

  const validate = () => {
    const { name, email, phone, licenseNumber, address } = form;
    if (!name || !email || !phone || !licenseNumber || !address) {
      setMessage("❌ All fields are required.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("❌ Invalid email format.");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      setMessage("❌ Phone must be exactly 10 digits.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!validate()) return;

    try {
      await axios.post(`${API_BASE_URL}/api/drivers`, form);
      setMessage("✅ Driver added successfully!");
      setTimeout(() => navigate("/drivers"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add driver.");
    }
  };

  return (
    <div style={container}>
      <header style={header}>
        <h1 style={headerTitle}>👤 Add Driver</h1>
      </header>

      <main style={main}>
        <div style={card}>
          {message && (
            <p
              style={{
                color: message.startsWith("✅") ? "#388e3c" : "#d32f2f",
                marginBottom: 12,
                fontWeight: "bold",
              }}
            >
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit} style={formStyle}>
            {[
              { name: "name", placeholder: "Name" },
              { name: "email", placeholder: "Email", type: "email" },
              { name: "phone", placeholder: "Phone" },
              { name: "licenseNumber", placeholder: "License Number" },
              { name: "address", placeholder: "Address" },
            ].map(({ name, placeholder, type }) => (
              <input
                key={name}
                name={name}
                type={type || "text"}
                placeholder={placeholder}
                value={(form as any)[name]}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            ))}

            <div style={btnGroup}>
              <button type="submit" style={btnPrimary}>
                Add Driver
              </button>
              <button
                type="button"
                style={btnSecondary}
                onClick={() => navigate("/drivers")}
              >
                ← Back to Drivers
              </button>
            </div>
          </form>
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

// --- Card & Form ---
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

// --- Buttons ---
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
