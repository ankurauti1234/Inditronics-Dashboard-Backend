const mongoose = require("mongoose");

const MqttDataSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  payload: { type: String, required: true },
  receivedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MqttData", MqttDataSchema);
