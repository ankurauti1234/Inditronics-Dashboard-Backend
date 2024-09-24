// models/tempModel.js
const mongoose = require("mongoose");

const tempDataSchema = new mongoose.Schema({
  Timestamp: { type: Date, required: true },
  Temperature: { type: Number, required: true },
  Conveyor_Speed: { type: Number, required: true },
  isPrediction: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model("TempData", tempDataSchema);
