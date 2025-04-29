// src/pages/DriverDashboardPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import DriverNotification from "../pages/DeliveryNotification";

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

  const sendTestNotification = async () => {
    try {
      // Triggers your backend test‐notification endpoint
      await axios.get(`${API}/api/test-notif/${DRIVER_ID}`);
    } catch (err) {
      console.error("❌ Test notification failed", err);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* 1) This pop-up stays hidden until a socket event arrives */}
      <DriverNotification />

      {/* 2) Your page header */}
      <header style={{ background: "#e1f5fe", padding: "16px" }}>
        <h1 style={{ margin: 0, color: "#01579b" }}>🚚 Driver Portal</h1>
        <button
          onClick={sendTestNotification}
          style={{
            marginTop: "8px",
            padding: "8px 12px",
            background: "#0288d1",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          🔔 Test Notification
        </button>
      </header>

      {/* 3) The rest of your dashboard */}
      <main style={{ flex: 1, padding: "24px", background: "#fafafa" }}>
        <h2 style={{ color: "#01579b" }}>🚚 Deliveries Assigned</h2>
        {deliveries.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "#666" }}>No deliveries assigned.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px"
            }}
          >
            {deliveries.map(d => (
              <div
                key={d._id}
                style={{
                  background: "#fff",
                  borderRadius: "8px",
                  padding: "16px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                }}
              >
                <p><strong>Customer:</strong> {d.customerId}</p>
                <p><strong>Address:</strong>  {d.address}</p>
                <p><strong>Status:</strong>   {d.status}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 4) Your footer */}
      <footer style={{ background: "#e1f5fe", padding: "12px", textAlign: "center" }}>
        © 2025 Delivery Dashboard
      </footer>
    </div>
  );
}
