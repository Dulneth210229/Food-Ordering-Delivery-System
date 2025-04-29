// src/pages/EditDriverPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

interface DriverForm {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  address: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function EditDriverPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<DriverForm>({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Load existing driver
  useEffect(() => {
    if (!id) return;
    axios
      .get<DriverForm>(`${API_BASE_URL}/api/drivers/${id}`)
      .then((res) => setForm(res.data))
      .catch(() => setMessage("❌ Failed to load driver"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/drivers/${id}`, form);
      setMessage("✅ Driver updated!");
      setTimeout(() => navigate("/drivers"), 1000);
    } catch {
      setMessage("❌ Update failed");
    }
  };

  if (loading) {
    return <p style={loadingStyle}>Loading driver…</p>;
  }

  return (
    <div style={container}>
      <header style={header}>
        <h1 style={headerTitle}>✏️ Edit Driver</h1>
        <div>
          <Link to="/drivers" style={headerBtn}>
            ← Driver List
          </Link>
          <Link to="/" style={headerBtn}>
            Dashboard
          </Link>
        </div>
      </header>

      <main style={main}>
        <div style={card}>
          {message && (
            <p style={{ color: message.startsWith("✅") ? "#388e3c" : "#d32f2f" }}>
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} style={formStyle}>
            {(["name", "email", "phone", "licenseNumber", "address"] as const).map((field) => (
              <input
                key={field}
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                required
                style={inputStyle}
              />
            ))}

            <div style={btnGroup}>
              <button type="submit" style={btnPrimary}>
                Update
              </button>
              <button
                type="button"
                onClick={() => navigate("/drivers")}
                style={btnSecondary}
              >
                ← Back
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
  alignItems: "center",
};

const card: React.CSSProperties = {
  width: "100%",
  maxWidth: "400px",
  background: "#fff",
  padding: "24px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const loadingStyle: React.CSSProperties = {
  textAlign: "center",
  marginTop: "40px",
  fontSize: "1.2rem",
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

const footer: React.CSSProperties = {
  background: "#e1f5fe",
  padding: "12px 0",
  textAlign: "center",
};
