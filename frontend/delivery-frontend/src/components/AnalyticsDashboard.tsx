import React, { useEffect, useState } from "react";
import axios from "axios";

interface Delivery {
  status: string;
}

interface Driver {
  isAvailable: boolean;
}

export default function AnalyticsDashboard() {
  const [totalDeliveries, setTotalDeliveries] = useState<number>(0);
  const [activeDrivers, setActiveDrivers] = useState<number>(0);
  const [successRate, setSuccessRate] = useState<string>("0%");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [deliveriesRes, driversRes] = await Promise.all([
          axios.get("http://localhost:5000/api/delivery"),
          axios.get("http://localhost:5000/api/drivers")
        ]);

        const deliveries: Delivery[] = deliveriesRes.data;
        const drivers: Driver[] = driversRes.data;

        const deliveredCount = deliveries.filter((d: Delivery) => d.status === "Delivered").length;
        const totalCount = deliveries.length;

        setTotalDeliveries(totalCount);
        setActiveDrivers(drivers.filter((d: Driver) => d.isAvailable).length);
        setSuccessRate(
          totalCount > 0 ? `${Math.round((deliveredCount / totalCount) * 100)}%` : "0%"
        );
      } catch (err) {
        console.error("Failed to fetch analytics data", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Analytics Dashboard</h2>
      <p><strong>Total Deliveries:</strong> {totalDeliveries}</p>
      <p><strong>Active Drivers:</strong> {activeDrivers}</p>
      <p><strong>Success Rate:</strong> {successRate}</p>
    </div>
  );
}
