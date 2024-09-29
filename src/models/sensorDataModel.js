const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema({
  distance: Number,
  temperature: Number,
  humidity: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SensorData", sensorDataSchema);
