import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Driver {
  _id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  status: string;
  isAvailable?: boolean;
  currentOrders?: number;
  address?: string; // ✅ New field
}

export default function DriverList() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/drivers")
      .then((res) => setDrivers(res.data))
      .catch(() => setError("Failed to fetch drivers"));
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      try {
        await axios.delete(`http://localhost:5000/api/drivers/${id}`);
        setDrivers((prev) => prev.filter((d) => d._id !== id));
      } catch (err) {
        alert("❌ Failed to delete driver");
      }
    }
  };

  const filteredDrivers = drivers.filter((driver) =>
    (driver.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (driver.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Driver List</h2>

      <input
        type="text"
        placeholder="Search by name or email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "15px", padding: "8px", width: "100%" }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
  <tr>
    <th style={th}>Driver ID</th>
    <th style={th}>Name</th>
    <th style={th}>Email</th>
    <th style={th}>Phone</th>
    <th style={th}>License</th>
    <th style={th}>Status</th>
    <th style={th}>Available</th>
    <th style={th}>Address</th>
    <th style={th}>Actions</th>
  </tr>
</thead>
<tbody>
  {filteredDrivers.map((driver) => (
    <tr key={driver._id}>
      <td style={td}>{driver._id}</td>
      <td style={td}>{driver.name}</td>
      <td style={td}>{driver.email}</td>
      <td style={td}>{driver.phone}</td>
      <td style={td}>{driver.licenseNumber}</td>
      <td style={td}>{driver.status}</td>
      <td style={td}>{driver.address || "N/A"}</td>
      <td style={td}>
        <button
          style={editBtn}
          onClick={() => navigate(`/edit-driver/${driver._id}`)}
        >
          ✏️ Edit
        </button>
        <button
          style={deleteBtn}
          onClick={() => handleDelete(driver._id)}
        >
          🗑 Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

      </table>

      {/* ✅ Back Button */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

const th = {
  border: "1px solid #ccc",
  padding: "8px",
  background: "#f0f0f0",
  textAlign: "left" as const,
};

const td = {
  border: "1px solid #ccc",
  padding: "8px",
};

const editBtn = {
  marginRight: "8px",
  padding: "6px 10px",
  background: "#ffc107",
  color: "#000",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const deleteBtn = {
  padding: "6px 10px",
  background: "#dc3545",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
