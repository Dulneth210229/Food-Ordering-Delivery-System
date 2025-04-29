// src/pages/DeliveryDetailsPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Delivery {
  _id: string;
  customerId: string;
  driverId?: string;
  address: string;
  status: string;
  location: {
    lat: number;
    lng: number;
  };
}

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function DeliveryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    axios
      .get<Delivery>(`${API_BASE_URL}/api/delivery/${id}`)
      .then((res) => setDelivery(res.data))
      .catch((err) => {
        console.error("Failed to fetch delivery:", err);
        setError("Failed to load delivery details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div style={loadingStyle}>Loading delivery…</div>;
  }
  if (error || !delivery) {
    return <div style={errorStyle}>{error || "Delivery not found."}</div>;
  }

  return (
    <div style={container}>
      <header style={header}>
        <h1 style={headerTitle}>📦 Delivery Details</h1>
      </header>

      <main style={main}>
        <div style={card}>
          <p><strong>Customer ID:</strong> {delivery.customerId}</p>
          <p><strong>Status:</strong> {delivery.status}</p>
          <p><strong>Driver ID:</strong> {delivery.driverId || "Not assigned"}</p>
          <p><strong>Delivery Address:</strong> {delivery.address}</p>

          <div style={btnGroup}>
            <button style={btnSecondary} onClick={() => navigate("/")}>
              ← Back to Dashboard
            </button>
            <button style={btnPrimary} onClick={() => navigate(`/tracking/${delivery._id}`)}>
              🚚 Track Delivery
            </button>
            <button
              style={btnPrimary}
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(delivery.address)}`,
                  "_blank"
                )
              }
            >
              📍 Open in Google Maps
            </button>
          </div>
        </div>
      </main>

      <footer style={footer}>© 2025 Delivery Dashboard</footer>
    </div>
  );
}

// Layout styles
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
const card: React.CSSProperties = {
  background: "#fff",
  padding: "24px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  maxWidth: "500px",
  width: "100%",
  textAlign: "left",
  lineHeight: 1.6,
};
const btnGroup: React.CSSProperties = {
  marginTop: "24px",
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  flexWrap: "wrap",
};
const btnBase: React.CSSProperties = {
  padding: "10px 18px",
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
const loadingStyle: React.CSSProperties = {
  padding: "40px",
  fontSize: "1.2rem",
  textAlign: "center",
};
const errorStyle: React.CSSProperties = {
  padding: "40px",
  fontSize: "1.2rem",
  textAlign: "center",
  color: "red",
};
