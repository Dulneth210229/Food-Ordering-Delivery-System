// services/assignmentService.js

const Driver = require('../models/driver');
const geocodeAddress = require('../utils/geocode');

module.exports.assignDriver = async (deliveryLocation) => {
  // 🔎 Fetch all drivers—ignore any availability flag
  const drivers = await Driver.find();
  if (!drivers.length) {
    throw new Error('No drivers found');
  }

  let closestDriver = null;
  let shortestDistance = Infinity;

  // 🔍 Iterate every driver, geocode their address, compute distance
  for (const driver of drivers) {
    if (!driver.address) continue;            // skip if they have no stored address

    const driverGeo = await geocodeAddress(driver.address);
    if (!driverGeo) continue;                 // skip if geocoding fails

    const dist = getDistance(deliveryLocation, driverGeo);
    if (dist < shortestDistance) {
      shortestDistance = dist;
      closestDriver = driver;
    }
  }

  if (!closestDriver) {
    throw new Error('Could not find any driver with a valid address');
  }

  // ⚠️ Do NOT update availability or order count here
  return closestDriver;
};

// Haversine formula to compute kilometers between two lat/lng
function getDistance(loc1, loc2) {
  const R = 6371; // km
  const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
  const dLng = (loc2.lng - loc1.lng) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(loc1.lat * (Math.PI / 180)) *
    Math.cos(loc2.lat * (Math.PI / 180)) *
    Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
