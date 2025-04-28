import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

interface Delivery {
  _id: string;
  customerId: string;
  driverId: string;
  status: string;
  location: {
    lat: number;
    lng: number;
  };
}

export default function DeliveryDashboard() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/delivery")
      .then((res) => setDeliveries(res.data))
      .catch(() => alert("❌ Failed to fetch deliveries"));
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this delivery?")) {
      try {
        await axios.delete(`http://localhost:5000/api/delivery/${id}`);
        setDeliveries((prev) => prev.filter((d) => d._id !== id));
      } catch (err) {
        alert("❌ Failed to delete delivery");
      }
    }
  };

  const filteredDeliveries = deliveries.filter(
    (d) =>
      (d.customerId?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (d.status?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Delivery Dashboard</h1>

      <div style={{ marginBottom: "15px" }}>
        <Link to="/create">
          <button style={{ padding: "10px", marginRight: "10px" }}>+ New Delivery</button>
        </Link>
        <Link to="/add-driver">
          <button style={{ padding: "10px", marginRight: "10px" }}>+ Add Driver</button>
        </Link>
        <Link to="/drivers">
          <button style={{ padding: "10px" }}>View Drivers</button>
        </Link>
        <Link to="/analytics">
          <button style={{ padding: "10px", marginLeft: "10px" }}>📈 Analytics</button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search by Customer ID or Status"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: "8px", width: "100%", marginBottom: "20px" }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>Customer ID</th>
            <th style={th}>Status</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDeliveries.map((delivery) => (
            <tr key={delivery._id}>
              <td style={td}>{delivery.customerId}</td>
              <td style={td}>{delivery.status}</td>
              <td style={td}>
                <button onClick={() => navigate(`/delivery/${delivery._id}`)} style={btn}>View</button>
                <button onClick={() => navigate(`/edit-delivery/${delivery._id}`)} style={editBtn}>Edit</button>
                <button onClick={() => handleDelete(delivery._id)} style={deleteBtn}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  border: "1px solid #ccc",
  padding: "10px",
  background: "#f9f9f9",
  textAlign: "left" as const,
};

const td = {
  border: "1px solid #ccc",
  padding: "10px",
};

const btn = {
  padding: "6px 10px",
  marginRight: "6px",
};

const editBtn = {
  ...btn,
  background: "#ffc107",
  border: "none",
  borderRadius: "4px",
  color: "black",
  cursor: "pointer",
};

const deleteBtn = {
  ...btn,
  background: "#dc3545",
  border: "none",
  borderRadius: "4px",
  color: "white",
  cursor: "pointer",
};
