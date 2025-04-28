import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader
} from "@react-google-maps/api";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

const containerStyle = { width: "100%", height: "600px" };
const defaultCenter = { lat: 6.9271, lng: 79.8612 };

export default function DeliveryTracking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const mapRef = useRef<google.maps.Map | null>(null);

  const [driverAddress, setDriverAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [driverLocation, setDriverLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [destination, setDestination] = useState<google.maps.LatLngLiteral | null>(null);
  const [routePath, setRoutePath] = useState<google.maps.LatLngLiteral[]>([]);
  const [distanceText, setDistanceText] = useState("");
  const [durationText, setDurationText] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"]
  });

  // 1️⃣ Fetch delivery & driver data, geocode driver
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data: delivery } = await axios.get(`${API_BASE_URL}/api/delivery/${id}`);
        setDeliveryAddress(delivery.address);
        setDestination(delivery.location);

        const { data: driver } = await axios.get(`${API_BASE_URL}/api/drivers/${delivery.driverId}`);
        setDriverAddress(driver.address);

        const { data: geo } = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json`,
          { params: { address: driver.address, key: GOOGLE_MAPS_API_KEY } }
        );
        const loc = geo.results[0].geometry.location;
        setDriverLocation({ lat: loc.lat, lng: loc.lng });
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  // 2️⃣ Compute route, extract path + info
  useEffect(() => {
    if (!driverLocation || !destination || !isLoaded) return;
    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: driverLocation,
        destination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === "OK" && result) {
          const leg = result.routes[0].legs[0];
          setDistanceText(leg.distance?.text || "");
          setDurationText(leg.duration?.text || "");
          // Build an array of {lat,lng} for the polyline
          const path = result.routes[0].overview_path.map(pt => ({
            lat: pt.lat(),
            lng: pt.lng()
          }));
          setRoutePath(path);
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  }, [driverLocation, destination, isLoaded]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>🚚 Delivery Tracking</h2>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "10px",
          padding: "8px 16px",
          background: "#6c757d",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        ← Back
      </button>

      <div style={{ marginBottom: "16px" }}>
        <p><strong>Driver Address:</strong> {driverAddress}</p>
        <p><strong>Delivery Address:</strong> {deliveryAddress}</p>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={driverLocation || destination || defaultCenter}
        zoom={12}
        onLoad={map => { mapRef.current = map; }}
      >
        {driverLocation && <Marker position={driverLocation} label="🚚" />}
        {destination && <Marker position={destination} label="📍" />}
        {routePath.length > 0 && (
          <Polyline path={routePath} options={{ strokeWeight: 4 }} />
        )}
      </GoogleMap>
    </div>
  );
}
