// src/pages/DriverDetailsPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Driver {
  _id:     string;
  name:    string;
  email:   string;
  phone:   string;
  address: string;
}

export default function DriverDetailsPage() {
  const [driver,  setDriver]  = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  // ← pick up your env-vars
  const API      = process.env.REACT_APP_API_URL!;
  const driverId = process.env.REACT_APP_DRIVER_ID!;

  useEffect(() => {
    axios
      .get<Driver>(`${API}/api/drivers/${driverId}`)
      .then(res => {
        setDriver(res.data);
      })
      .catch(err => {
        console.error("Error fetching driver:", err);
        setError("Failed to load driver profile.");
      })
      .finally(() => setLoading(false));
  }, [API, driverId]);

  if (loading) return <p>Loading driver details…</p>;
  if (error)   return <p style={{color:"red"}}>{error}</p>;
  if (!driver) return <p style={{color:"red"}}>Driver not found.</p>;

  return (
    <div style={{ padding:20, fontFamily:"Arial,sans-serif" }}>
      <h2>👤 Driver Profile</h2>
      <p><strong>Name:</strong>    {driver.name}</p>
      <p><strong>Email:</strong>   {driver.email}</p>
      <p><strong>Phone:</strong>   {driver.phone}</p>
      <p><strong>Address:</strong> {driver.address}</p>
    </div>
  );
}
