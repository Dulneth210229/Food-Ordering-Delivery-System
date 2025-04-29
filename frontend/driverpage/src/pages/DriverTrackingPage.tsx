// src/pages/DriverTrackingPage.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const containerStyle = { width: "100%", height: "600px" };
const API_BASE_URL   = process.env.REACT_APP_API_URL!;
const GMKEY          = process.env.REACT_APP_GOOGLE_MAPS_API_KEY!;

export default function DriverTrackingPage() {
  const navigate = useNavigate();
  const mapRef   = useRef<google.maps.Map|null>(null);

  const [driverLoc,   setDriverLoc]   = useState<google.maps.LatLngLiteral|null>(null);
  const [deliveryLoc, setDeliveryLoc] = useState<google.maps.LatLngLiteral|null>(null);
  const [directions,  setDirections]  = useState<google.maps.DirectionsResult|null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GMKEY,
    libraries: ["places"],
  });

  // ① fetch & geocode
  useEffect(() => {
    (async () => {
      try {
        const driverId = process.env.REACT_APP_DRIVER_ID!;
        const delRes = await axios.get<{ _id: string; location: google.maps.LatLngLiteral }[]>(
          `${API_BASE_URL}/api/delivery/driver/${driverId}`
        );
        if (!delRes.data.length) return;
        setDeliveryLoc(delRes.data[0].location);

        const drvRes = await axios.get<{ address: string }>(
          `${API_BASE_URL}/api/drivers/${driverId}`
        );
        const geo = await axios.get<{ results: any[]; status: string }>(
          `https://maps.googleapis.com/maps/api/geocode/json`,
          { params: { address: drvRes.data.address, key: GMKEY } }
        );
        if (geo.data.status === "OK" && geo.data.results.length) {
          const loc = geo.data.results[0].geometry.location;
          setDriverLoc({ lat: loc.lat, lng: loc.lng });
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // ② request directions
  useEffect(() => {
    if (!isLoaded || !driverLoc || !deliveryLoc) return;
    const svc = new google.maps.DirectionsService();
    svc.route(
      { origin: driverLoc, destination: deliveryLoc, travelMode: google.maps.TravelMode.DRIVING },
      (res, status) => {
        if (status === "OK" && res) {
          setDirections(res);
          mapRef.current?.fitBounds(res.routes[0].bounds);
        }
      }
    );
  }, [isLoaded, driverLoc, deliveryLoc]);

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading map…</div>;

  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginBottom: 12, padding: "8px 16px",
          background: "#6c757d", color:"#fff",
          border: "none", borderRadius:4, cursor:"pointer"
        }}
      >
        ← Back
      </button>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={driverLoc||deliveryLoc||{lat:0,lng:0}}
        zoom={12}
        onLoad={map => { mapRef.current = map; }}
      >
        {driverLoc   && <Marker position={driverLoc}   label="👤" />}
        {deliveryLoc && <Marker position={deliveryLoc} label="📍" />}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{ suppressMarkers:true, polylineOptions:{ strokeColor:"#28a745", strokeWeight:6 } }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
