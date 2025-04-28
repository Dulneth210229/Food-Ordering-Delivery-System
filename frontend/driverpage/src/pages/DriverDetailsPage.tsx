import React, { useEffect, useState } from "react";
import axios from "axios";

interface Driver {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const DriverDetailsPage: React.FC = () => {
  const [driver, setDriver] = useState<Driver | null>(null);
  const driverId = "driver123"; // Replace with your driver id

  useEffect(() => {
    axios.get(`http://localhost:5000/api/drivers/${driverId}`)
      .then((res) => setDriver(res.data))
      .catch((err) => console.error("Error fetching driver:", err));
  }, [driverId]);

  if (!driver) return <p>Loading driver details...</p>;

  return (
    <div>
      <h2>👤 Driver Profile</h2>
      <p><strong>Name:</strong> {driver.name}</p>
      <p><strong>Email:</strong> {driver.email}</p>
      <p><strong>Phone:</strong> {driver.phone}</p>
      <p><strong>Address:</strong> {driver.address}</p>
    </div>
  );
};

export default DriverDetailsPage;
