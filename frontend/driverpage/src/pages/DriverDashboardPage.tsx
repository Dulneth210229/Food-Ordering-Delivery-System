// src/pages/DriverDashboardPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Delivery {
  _id: string;
  customerId: string;
  address: string;
  status: string;
}

const API       = process.env.REACT_APP_API_URL!;
const DRIVER_ID = process.env.REACT_APP_DRIVER_ID!;

export default function DriverDashboardPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    axios
      .get<Delivery[]>(`${API}/api/delivery/driver/${DRIVER_ID}`)
      .then(res => setDeliveries(res.data))
      .catch(err => console.error("Error fetching deliveries:", err));
  }, []);

  return (
    <main style={main}>
      <h2 style={title}>🚚 Deliveries Assigned</h2>

      {deliveries.length === 0 ? (
        <p style={empty}>No deliveries assigned.</p>
      ) : (
        <div style={cardGrid}>
          {deliveries.map(d => (
            <div key={d._id} style={card}>
              <p><strong>Customer:</strong> {d.customerId}</p>
              <p><strong>Address:</strong> {d.address}</p>
              <p><strong>Status:</strong>  {d.status}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────
// Page-specific styles (App.tsx provides header/footer)

const main: React.CSSProperties = {
  flex: 1,
  padding: "24px",
  background: "#fafafa",
};

const title: React.CSSProperties = {
  margin: "0 0 16px",
  color: "#01579b",
};

const empty: React.CSSProperties = {
  fontStyle: "italic",
  color: "#666",
};

const cardGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "20px",
};

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: "8px",
  padding: "16px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  lineHeight: 1.5,
};
