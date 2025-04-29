// confirmation-notification-service/app.js
const express = require("express");
const http    = require("http");
const { Server } = require("socket.io");

const app   = express();
const server = http.createServer(app);
const io    = new Server(server, { /* cors etc */ });

// 1️⃣: When a client connects, let them join their driver-room
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-driver", (driverId) => {
    socket.join(driverId);
    console.log(`Socket ${socket.id} joined room ${driverId}`);
  });
});

// 2️⃣: Test-notification endpoint
app.get("/api/test-notif/:driverId", (req, res) => {
  const { driverId } = req.params;

  // Fake “new delivery” payload
  const payload = {
    deliveryId: "demo-123",
    customerName: "Alice Johnson",
    pickup: "123 Main St",
    dropoff: "456 Elm St"
  };

  // Emit to just that driver’s room
  io.to(driverId).emit("newDelivery", payload);
  console.log(`Emitted newDelivery to ${driverId}`, payload);

  res.json({ success: true, payload });
});

// start your server on PORT (e.g. 5001 so you don’t clash)
const PORT = process.env.PORT || 5001;
server.listen(PORT, () =>
  console.log(`Notification service listening on ${PORT}`)
);
