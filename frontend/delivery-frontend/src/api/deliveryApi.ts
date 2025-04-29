import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ✅ Fetch all deliveries
export const fetchDeliveries = () =>
  axios.get(`${API_BASE_URL}/api/delivery`);

// ✅ Assign a driver to a specific delivery (manual assignment)
export const assignDriver = (deliveryId: string, driverId: string) =>
  axios.put(`${API_BASE_URL}/api/delivery/${deliveryId}/assign`, { driverId });

// ✅ Get a delivery by ID
export const getDeliveryById = (id: string) =>
  axios.get(`${API_BASE_URL}/api/delivery/get/${id}`);

// ✅ Create a new delivery (with automatic driver assignment)
export const createDelivery = async (data: any) => {
  const res = await axios.post(`${API_BASE_URL}/api/delivery`, data);
  return res; // 🔁 Return full response, not just res.data
};

// ✅ Update delivery status (e.g., mark as Delivered)
export const updateDeliveryStatus = (deliveryId: string, status: string) =>
  axios.put(`${API_BASE_URL}/api/deliveries/status`, { deliveryId, status });
