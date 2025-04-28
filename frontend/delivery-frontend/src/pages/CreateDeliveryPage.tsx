import React from "react";
import { useNavigate } from "react-router-dom";
import CreateDeliveryForm from "../components/CreateDeliveryForm";

export default function CreateDeliveryPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <CreateDeliveryForm />

     
    </div>
  );
}
