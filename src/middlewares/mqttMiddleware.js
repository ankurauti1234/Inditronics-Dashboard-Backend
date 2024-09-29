const SensorData = require("../models/sensorDataModel");
const Event = require("../models/eventsModel");
const eventsController = require("../controllers/eventsController");

module.exports = async (topic, payload) => {
  try {
    const payloadData = JSON.parse(payload.toString());
    console.log("Processing message for topic:", topic);
    console.log("Payload data parsed:", payloadData);

    if (topic === "esp32/sensors") {
      // Handle sensor data
      if (
        payloadData.distance !== undefined &&
        payloadData.temperature !== undefined &&
        payloadData.humidity !== undefined
      ) {
        const sensorData = new SensorData({
          distance: payloadData.distance,
          temperature: payloadData.temperature,
          humidity: payloadData.humidity,
          timestamp: new Date(),
        });
        await sensorData.save();
        console.log("Sensor data saved to MongoDB");
      } else {
        console.log("Invalid sensor data received:", payloadData);
      }
    } else if (topic === "apm/device/events") {
      // Handle event data
      await eventsController.saveEvent(payloadData);
      console.log("Event data saved to MongoDB");
    } else {
      console.log("Unhandled topic:", topic);
    }
  } catch (error) {
    console.error("Error processing MQTT message:", error);
  }
};
