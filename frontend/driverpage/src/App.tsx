// src/App.tsx
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate
} from "react-router-dom";
import axios from "axios";

import DriverDashboardPage from "./pages/DriverDashboardPage";
import DriverDetailsPage   from "./pages/DriverDetailsPage";
import DriverTrackingPage  from "./pages/DriverTrackingPage";
import DriverNotification  from "./pages/DeliveryNotification";

const API       = process.env.REACT_APP_API_URL!;     // e.g. "http://localhost:5000"
const DRIVER_ID = process.env.REACT_APP_DRIVER_ID!;  // your driver _id_

export default function App() {
  const handleTestNotif = async () => {
    try {
      await axios.get(`${API}/api/test-notif/${DRIVER_ID}`);
      alert("✅ Test notification sent!");
    } catch (err) {
      console.error("❌ Test-notif error:", err);
      alert("❌ Could not trigger test notification. See console.");
    }
  };

  return (
    <BrowserRouter>
      {/* Always listening for real-time notifications */}
      <DriverNotification />

      {/* Page wrapper: flex column to push footer down */}
      <div style={pageStyle}>
        {/* Global Header */}
        <header style={headerStyle}>
          <h1 style={logoStyle}>🚚 Driver Portal</h1>
          <nav style={navStyle}>
            <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
            <Link to="/profile"   style={linkStyle}>Profile</Link>
            <Link to="/tracking"  style={linkStyle}>Tracking</Link>
            <button onClick={handleTestNotif} style={testBtnStyle}>
              🚨 Test Notification
            </button>
          </nav>
        </header>

        {/* Main Content */}
        <main style={contentStyle}>
          <Routes>
            <Route path="/"          element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DriverDashboardPage />} />
            <Route path="/profile"   element={<DriverDetailsPage />} />
            <Route path="/tracking"  element={<DriverTrackingPage />} />
            <Route path="*"          element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer style={footerStyle}>
          © 2025 Delivery Dashboard
        </footer>
      </div>
    </BrowserRouter>
  );
}


// ─────────────────────────────────────────────────────────────────
// Layout & Styling

const pageStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",    // full viewport height
};

const headerStyle: React.CSSProperties = {
  background: "#e1f5fe",
  padding: "16px 24px",
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const logoStyle: React.CSSProperties = {
  margin: 0,
  color: "#01579b",
  fontSize: "1.8rem",
  fontWeight: "bold",
};

const navStyle: React.CSSProperties = {
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const linkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#0288d1",
  fontWeight: 500,
};

const testBtnStyle: React.CSSProperties = {
  padding: "6px 12px",
  background: "#d32f2f",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "0.9rem",
};

const contentStyle: React.CSSProperties = {
  flex: 1,              // grow to fill available space
  background: "#fafafa",
  padding: "24px",      // optional padding
};

const footerStyle: React.CSSProperties = {
  background: "#e1f5fe",
  padding: "12px 24px",
  textAlign: "center",
  fontSize: "0.9rem",
  color: "#555",
};
