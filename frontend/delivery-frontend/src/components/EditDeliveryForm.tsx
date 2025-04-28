import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditDeliveryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    customerId: "",
    address: "",
    status: "Assigned",
  });

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/api/delivery/${id}`) // ✅ FIXED endpoint
        .then((res) => {
          const delivery = res.data;
          setForm({
            customerId: delivery.customerId,
            address: delivery.address || "", // ✅ use correct field name
            status: delivery.status,
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading delivery:", err);
          setMessage("❌ Failed to load delivery");
          setLoading(false);
        });
    } else {
      setMessage("❌ Delivery ID is missing");
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/delivery/${id}`, form); // ✅ ensure correct path
      setMessage("✅ Delivery updated successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Error updating delivery:", err);
      setMessage("❌ Failed to update delivery");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Edit Delivery</h2>
      <input
        name="customerId"
        placeholder="Customer ID"
        value={form.customerId}
        onChange={handleChange}
        required
        style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
      />
      <input
        name="address"
        placeholder="Delivery Address"
        value={form.address}
        onChange={handleChange}
        required
        style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
      />
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
      >
        <option value="Assigned">Assigned</option>
        <option value="Pending">Pending</option>
        <option value="In Transit">In Transit</option>
        <option value="Delivered">Delivered</option>
      </select>
      <div>
        <button type="submit" style={{ padding: "10px 20px", marginRight: "10px" }}>Update</button>
        <button
          type="button"
          onClick={() => navigate("/")}
          style={{ padding: "10px 20px", backgroundColor: "#6c757d", color: "#fff", border: "none", borderRadius: "4px" }}
        >
          ← Back to Dashboard
        </button>
      </div>
      {message && <p style={{ color: message.includes("✅") ? "green" : "red", marginTop: "10px" }}>{message}</p>}
    </form>
  );
}
