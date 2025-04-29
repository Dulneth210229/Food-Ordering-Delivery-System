// src/components/DeliveryTracking.tsx

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Polyline,
  useJsApiLoader
} from "@react-google-maps/api";

const API_BASE_URL         = process.env.REACT_APP_API_URL || "http://localhost:5000";
const SOCKET_URL          = process.env.REACT_APP_API_URL || "http://localhost:5000";
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

const containerStyle = { width: "100%", height: "600px" };
const defaultCenter   = { lat: 6.9271, lng: 79.8612 };

export default function DeliveryTracking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const mapRef = useRef<google.maps.Map|null>(null);

  // Addresses & coordinates
  const [driverAddress, setDriverAddress]     = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [driverLocation, setDriverLocation]   = useState<google.maps.LatLngLiteral|null>(null);
  const [destination, setDestination]         = useState<google.maps.LatLngLiteral|null>(null);

  // Directions & live path
  const [directions, setDirections]               = useState<google.maps.DirectionsResult|null>(null);
  const [routeCoordinates, setRouteCoordinates]   = useState<google.maps.LatLngLiteral[]>([]);

  // Load Google Maps JS API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"]
  });

  // 1️⃣ Fetch delivery & driver, then geocode driver address
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        // Fetch delivery
        const { data: delivery } = await axios.get(`${API_BASE_URL}/api/delivery/${id}`);
        setDeliveryAddress(delivery.address);
        setDestination(delivery.location);

        // Fetch driver
        const { data: driver } = await axios.get(`${API_BASE_URL}/api/drivers/${delivery.driverId}`);
        setDriverAddress(driver.address);

        // Geocode driver address
        const { data: geo } = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json`,
          { params: { address: driver.address, key: GOOGLE_MAPS_API_KEY } }
        );
        const loc = geo.results[0].geometry.location;
        setDriverLocation({ lat: loc.lat, lng: loc.lng });

        // Seed live path with initial position
        setRouteCoordinates([{ lat: loc.lat, lng: loc.lng }]);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    })();
  }, [id]);

  // 2️⃣ Compute the planned route and fit bounds
  useEffect(() => {
    if (!isLoaded || !driverLocation || !destination) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: driverLocation,
        destination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
          mapRef.current?.fitBounds(result.routes[0].bounds);
        } else {
          console.error("Directions failed:", status);
        }
      }
    );
  }, [isLoaded, driverLocation, destination]);

  // 3️⃣ Listen for live driver updates and extend the live path
  useEffect(() => {
    if (!id) return;
    const socket = io(SOCKET_URL);

    // Join this delivery's room
    socket.emit("trackDelivery", id);

    // On each driverLocationUpdate, move marker & extend polyline
    socket.on("driverLocationUpdate", (loc: { lat: number; lng: number }) => {
      setDriverLocation(loc);
      setRouteCoordinates(path => [...path, loc]);
    });

    return () => {
      socket.off("driverLocationUpdate");
      socket.disconnect();
    };
  }, [id]);

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map…</div>;

  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: 10,
          padding: "8px 16px",
          background: "#6c757d",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer"
        }}
      >
        ← Back
      </button>

      <div style={{ marginBottom: 16 }}>
        <p><strong>Driver Address:</strong> {driverAddress}</p>
        <p><strong>Delivery Address:</strong> {deliveryAddress}</p>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={driverLocation || destination || defaultCenter}
        zoom={12}
        onLoad={map => { mapRef.current = map!; }}
      >
        {/* Driver marker */}
        {driverLocation && <Marker position={driverLocation} label="🚚" />}

        {/* Delivery marker */}
        {destination && <Marker position={destination} label="📍" />}

        {/* Planned static route in green */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: "#28a745",  // green
                strokeOpacity: 0.6,
                strokeWeight: 4
              }
            }}
          />
        )}

        {/* Live traveled path in green */}
        {routeCoordinates.length > 1 && (
          <Polyline
            path={routeCoordinates}
            options={{
              strokeColor: "#28a745",  // green
              strokeOpacity: 0.8,
              strokeWeight: 4,
              icons: [{
                icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
                offset: "100%"
              }]
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
