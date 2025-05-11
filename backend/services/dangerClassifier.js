const axios = require("axios");

exports.assessDangerLevel = async (lat, lon) => {
  try {
    const res = await axios.post("http://localhost:5001/danger-level", {
      hazard: { lat, lon },
      radius: 300, // meters
    });
    return res.data.level;
  } catch (error) {
    console.error("Danger level assessment failed:", error.message);
    return "Unknown";
  }
}
