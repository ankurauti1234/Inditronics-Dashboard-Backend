// models/DataPoint.js
const mongoose = require("mongoose");

const DataPointSchema = new mongoose.Schema({
  timestamp: Date,
  temperature: Number,
  conveyorSpeed: Number,
  prediction: {
    timestamp: Date,
    temperature: Number,
    conveyorSpeed: Number,
  },
});

module.exports = mongoose.model("DataPoint", DataPointSchema);
