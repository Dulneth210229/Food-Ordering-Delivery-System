import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddDriverForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
    address: "",
    status: "active",
    isAvailable: true,
    currentOrders: 0
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, email, phone, licenseNumber, address } = form;
    if (!name || !email || !phone || !licenseNumber || !address) {
      setMessage("❌ All fields are required.");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setMessage("❌ Invalid email format.");
      return false;
    }

    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phone)) {
      setMessage("❌ Phone number must be exactly 10 digits.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:5000/api/drivers", form);
      setMessage("✅ Driver added successfully!");
      setTimeout(() => navigate("/drivers"), 1500);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to add driver");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}
    >
      <h2>Add Driver</h2>

      {["name", "email", "phone", "licenseNumber", "address"].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={(form as any)[field]}
          onChange={handleChange}
          style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
          required
        />
      ))}

      <div>
        <button
          type="submit"
          style={{ padding: "10px 20px", marginRight: "10px" }}
        >
          Add Driver
        </button>
        <button
          type="button"
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "4px"
          }}
          onClick={() => navigate("/")}
        >
          ← Back to Dashboard
        </button>
      </div>

      {message && (
        <p
          style={{
            color: message.includes("✅") ? "green" : "red",
            marginTop: "10px"
          }}
        >
          {message}
        </p>
      )}
    </form>
  );
}
