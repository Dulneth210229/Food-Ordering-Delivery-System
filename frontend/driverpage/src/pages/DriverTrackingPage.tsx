import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const DriverTrackingPage: React.FC = () => {
  const navigate = useNavigate();

  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [routePath, setRoutePath] = useState<google.maps.LatLngLiteral[]>([]);
  const [deliveryId, setDeliveryId] = useState<string>(""); // ✅ Track current delivery ID

  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
  });

  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      if (response.data.status === "OK") {
        return response.data.results[0].geometry.location;
      } else {
        console.error("Geocoding failed:", response.data.status);
        return null;
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const driverId = "your_driver_id_here"; // 🛑 Replace with real logged-in driverId

        const deliveriesRes = await axios.get(`${API_BASE_URL}/api/deliveries/driver/${driverId}`);
        const deliveries = deliveriesRes.data;

        if (deliveries.length === 0) {
          console.warn("No deliveries found for driver.");
          return;
        }

        const delivery = deliveries[0]; // First delivery

        setDeliveryId(delivery._id); // ✅ Save delivery id

        if (delivery.location) {
          setDeliveryLocation(delivery.location);
        }

        const driverRes = await axios.get(`${API_BASE_URL}/api/drivers/${driverId}`);
        const driver = driverRes.data;

        if (driver.address) {
          const driverCoords = await geocodeAddress(driver.address);
          if (driverCoords) {
            setDriverLocation(driverCoords);
          }
        }
      } catch (error) {
        console.error("Error fetching delivery or driver info:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!driverLocation || !deliveryLocation || directions) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: driverLocation,
        destination: deliveryLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
          const path = result.routes[0].overview_path.map((latlng) => ({
            lat: latlng.lat(),
            lng: latlng.lng(),
          }));
          setRoutePath(path);
          setDriverLocation(path[0]);
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  }, [driverLocation, deliveryLocation, directions]);

  useEffect(() => {
    if (routePath.length === 0) return;

    let step = 0;
    const interval = setInterval(() => {
      if (step >= routePath.length - 1) {
        clearInterval(interval);
        return;
      }
      setDriverLocation(routePath[step + 1]);
      step++;
    }, 1000);

    return () => clearInterval(interval);
  }, [routePath]);

  const handleCompleteDelivery = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/deliveries/complete/${deliveryId}`);
      alert("✅ Delivery Completed Successfully!");
      navigate("/dashboard"); // Redirect after complete
    } catch (error) {
      alert("❌ Failed to complete delivery.");
    }
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>🚚 Real-Time Driver Tracking</h2>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/dashboard")} style={backButtonStyle}>
          ← Back to Dashboard
        </button>

        {/* ✅ Complete Delivery Button */}
        {deliveryId && (
          <button onClick={handleCompleteDelivery} style={completeButtonStyle}>
            ✅ Complete Delivery
          </button>
        )}
      </div>

      {driverLocation && deliveryLocation && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          onLoad={(map) => {
            mapRef.current = map;
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend(driverLocation);
            bounds.extend(deliveryLocation);
            map.fitBounds(bounds);
          }}
        >
          {/* Driver Marker */}
          <Marker
            position={driverLocation}
            label="Driver"
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          />

          {/* Delivery Marker */}
          <Marker
            position={deliveryLocation}
            label="Delivery"
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            }}
          />

          {/* Draw the Route */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: "#1E90FF",
                  strokeOpacity: 0.8,
                  strokeWeight: 6,
                },
              }}
            />
          )}
        </GoogleMap>
      )}
    </div>
  );
};

const backButtonStyle = {
  marginRight: "10px",
  padding: "10px 20px",
  backgroundColor: "#6c757d",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const completeButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default DriverTrackingPage;
