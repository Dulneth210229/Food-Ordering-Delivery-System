import React, { useEffect, useState } from "react";
import axios from "axios";

interface Delivery {
  _id: string;
  customerId: string;
  address: string;
  status: string;
}

const DriverDashboardPage: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const driverId = "driver123"; // Replace with your driver id

  useEffect(() => {
    axios.get(`http://localhost:5000/api/deliveries/driver/${driverId}`)
      .then((res) => setDeliveries(res.data))
      .catch((err) => console.error("Error fetching deliveries:", err));
  }, [driverId]);

  return (
    <div>
      <h2>🚚 Deliveries Assigned</h2>
      {deliveries.length === 0 ? (
        <p>No deliveries assigned.</p>
      ) : (
        <ul>
          {deliveries.map((delivery) => (
            <li key={delivery._id}>
              <strong>Customer:</strong> {delivery.customerId} <br />
              <strong>Address:</strong> {delivery.address} <br />
              <strong>Status:</strong> {delivery.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DriverDashboardPage;
