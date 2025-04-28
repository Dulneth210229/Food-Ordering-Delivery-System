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
      .get(`${API_BASE_URL}/api/delivery/${id}`)
      .then((res) => {
        setDelivery(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching delivery:", err);
        setError("Failed to fetch delivery");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error || !delivery) return <div>{error || "Delivery not found"}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Delivery Details</h2>

      <p><strong>Customer ID:</strong> {delivery.customerId}</p>
      <p><strong>Status:</strong> {delivery.status}</p>
      <p><strong>Driver ID:</strong> {delivery.driverId || "Not assigned"}</p>
      <p><strong>Delivery Address:</strong> {delivery.address}</p>

      <div style={{ marginTop: "20px", display: "flex", gap: "1rem" }}>
        <button
          onClick={() => navigate("/")}
          style={buttonStyle}
        >
          ← Back to Dashboard
        </button>

        <button
          onClick={() => navigate(`/tracking/${delivery._id}`)}
          style={buttonStylePrimary}
        >
          🚚 Track Delivery
        </button>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(delivery.address)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button style={buttonStylePrimary}>
            📍 Open in Google Maps
          </button>
        </a>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#6c757d",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const buttonStylePrimary = {
  padding: "10px 20px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
