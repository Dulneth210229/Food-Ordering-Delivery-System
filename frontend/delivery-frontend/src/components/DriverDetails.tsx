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

interface Driver {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function DeliveryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/delivery/${id}`);
        const deliveryData = res.data;
        setDelivery(deliveryData);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch delivery.");
      }
    };

    fetchDelivery();
  }, [id]);

  useEffect(() => {
    if (delivery?.driverId) {
      const fetchDriver = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/drivers/${delivery.driverId}`);
          const driverData = res.data;
          setDriver(driverData);
        } catch (error) {
          console.error(error);
          setError("Failed to fetch driver.");
        }
      };

      fetchDriver();
    }
  }, [delivery]); // <-- listen to delivery!

  if (!delivery && loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!delivery) return <div>Delivery not found</div>;

  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(delivery.address)}`;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Delivery Details</h2>

      <p><strong>Customer ID:</strong> {delivery.customerId}</p>
      <p><strong>Status:</strong> {delivery.status}</p>
      <p><strong>Driver ID:</strong> {delivery.driverId || "Not assigned"}</p>
      <p><strong>Driver Name:</strong> {driver?.name || "Not assigned"}</p> {/* ✅ Driver name here! */}
      <p><strong>Delivery Address:</strong> {delivery.address}</p>

      <div style={{ marginTop: "20px", display: "flex", gap: "1rem" }}>
        <button onClick={() => navigate("/")} style={backButtonStyle}>
          ← Back to Dashboard
        </button>

        <button onClick={() => navigate(`/tracking/${delivery._id}`)} style={trackButtonStyle}>
          🚚 Track Delivery
        </button>

        <a href={googleMapsLink} target="_blank" rel="noopener noreferrer">
          <button style={mapButtonStyle}>
            📍 Open in Google Maps
          </button>
        </a>
      </div>
    </div>
  );
}

const backButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#6c757d",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const trackButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const mapButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
