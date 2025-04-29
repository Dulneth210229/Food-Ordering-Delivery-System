import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DeliveryDashboard from "../pages/DeliveryDashboard";
import DeliveryDetails from "../components/DeliveryDetails";
import MapPage from "../pages/MapPage";
import CreateDeliveryPage from "../pages/CreateDeliveryPage";
import AddDriverForm from "../components/AddDriverForm";
import DriverDetails from "../components/DriverDetails";
import AddDriverPage from "../pages/AddDriverPage";
import DriverList from "../components/DriverList";
import EditDeliveryForm from "../components/EditDeliveryForm";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import EditDriverForm from "../components/EditDriverForm";
import DeliveryTracking from "../components/DeliveryTracking";
import DriverNotification  from '../components/DriverNotification';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/edit-driver/:id" element={<EditDriverForm />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/edit-delivery/:id" element={<EditDeliveryForm />} />
        <Route path="/drivers" element={<DriverList />} />
        <Route path="/add-driver" element={<AddDriverForm />} />
        <Route path="/driver/:id" element={<DriverDetails />} />
        <Route path="/add-driver" element={<AddDriverPage />} />
        <Route path="/" element={<DeliveryDashboard />} />
        <Route path="/delivery/:id" element={<DeliveryDetails />} />
        <Route path="/tracking/:id" element={<DeliveryTracking />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/create" element={<CreateDeliveryPage />} />
        <Route
          path="*"
          element={
            <div style={{ padding: "40px", fontSize: "18px" }}>
              🚫 Oops! Page not found or missing delivery ID.
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
