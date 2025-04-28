import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import DriverDashboardPage from "./pages/DriverDashboardPage";
import DriverDetailsPage from "./pages/DriverDetailsPage";
import DriverTrackingPage from "./pages/DriverTrackingPage";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "20px" }}>
        <h1>🚚 Driver Portal</h1>

        <nav style={{ marginBottom: "20px" }}>
          <Link to="/dashboard" style={{ marginRight: "10px" }}>Dashboard</Link>
          <Link to="/profile" style={{ marginRight: "10px" }}>Profile</Link>
          <Link to="/tracking">Tracking</Link>
        </nav>

        <Routes>
          <Route path="/dashboard" element={<DriverDashboardPage />} />
          <Route path="/profile" element={<DriverDetailsPage />} />
          <Route path="/tracking" element={<DriverTrackingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
