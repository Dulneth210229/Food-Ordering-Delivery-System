import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateDeliveryForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerId: "",
    address: "",

    status: "Assigned"
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const geocodeAddress = async (address: string) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    const response = await axios.get(url);
    const result = response.data.results[0];
    if (!result) throw new Error("Address could not be geocoded");

    return result.geometry.location; // { lat: ..., lng: ... }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { customerId, address, status } = form;
    if (!customerId || !address || !status) {
      setError("All fields are required");
      return;
    }

    try {
      const location = await geocodeAddress(address);

      await axios.post("http://localhost:5000/api/delivery", {
        customerId: form.customerId,
        address: form.address,        // ✅ Ensure it's address, not location
        status: form.status
      });
      

      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError(" Failed to create delivery. " + (err.message || ""));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "30px", maxWidth: "400px", margin: "auto", backgroundColor: "#fefefe", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Create Delivery</h2>

      <input
        style={input}
        type="text"
        name="customerId"
        placeholder="Customer ID"
        value={form.customerId}
        onChange={handleChange}
        required
      />

      <input
        style={input}
        type="text"
        name="address"
        placeholder="Delivery Address"
        value={form.address}
        onChange={handleChange}
        required
      />

      <select
        style={input}
        name="status"
        value={form.status}
        onChange={handleChange}
      >
        <option value="Assigned">Assigned</option>
        <option value="Pending">Pending</option>
        <option value="In Transit">In Transit</option>
        <option value="Delivered">Delivered</option>
      </select>

      <div>
        <button type="submit" style={submitBtn}>Create Delivery</button>
        <button
          type="button"
          style={backBtn}
          onClick={() => navigate("/")}
        >
          ← Back to Dashboard
        </button>
      </div>

      {error && <div style={{ color: "red", marginTop: "15px", fontWeight: "bold" }}>❌ {error}</div>}
    </form>
  );
}

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "16px"
};

const submitBtn = {
  padding: "10px 20px",
  fontSize: "16px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginRight: "10px"
};

const backBtn = {
  padding: "10px 20px",
  backgroundColor: "#6c757d",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};
