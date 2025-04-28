import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditDriverForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
    address: "", // ✅ new field
  });

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/api/drivers/${id}`)
        .then((res) => {
          const { name, email, phone, licenseNumber, address } = res.data;
          setForm({ name, email, phone, licenseNumber, address: address || "" });
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setMessage("❌ Failed to load driver");
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/drivers/${id}`, form);
      setMessage("✅ Driver updated successfully!");
      setTimeout(() => navigate("/drivers"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update driver");
    }
  };

  if (loading) return <p>Loading driver data...</p>;

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Edit Driver</h2>
      {["name", "email", "phone", "licenseNumber", "address"].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={(form as any)[field]}
          onChange={handleChange}
          required
          style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
        />
      ))}

      <div>
        <button type="submit" style={{ padding: "10px 20px", marginRight: "10px" }}>
          Update
        </button>
        <button
          type="button"
          onClick={() => navigate("/drivers")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          ← Back to Driver List
        </button>
      </div>

      {message && (
        <p style={{ color: message.includes("✅") ? "green" : "red", marginTop: "10px" }}>
          {message}
        </p>
      )}
    </form>
  );
}
