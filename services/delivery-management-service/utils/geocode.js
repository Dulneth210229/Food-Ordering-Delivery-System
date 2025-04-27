const axios = require('axios');

const geocodeAddress = async (address) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    console.log("🔑 Geocoding using API Key:", apiKey); // Add this line

    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address: address,
        key: apiKey
      }
    });

    const result = response.data.results[0];
    if (!result) return null;

    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng
    };
  } catch (error) {
    console.error("❌ Geocode error:", error.response?.data || error.message);
    return null;
  }
};

module.exports = geocodeAddress;
