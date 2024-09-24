const awsIot = require("aws-iot-device-sdk");
const { awsIotConfig } = require("./index");
const SensorData = require("../models/sensorDataModel");
const Event = require("../models/eventsModel");

const device = awsIot.device(awsIotConfig);

device.on("connect", () => {
  console.log("Connected to AWS IoT");
  device.subscribe("apm/device/events");
  device.subscribe("esp32/sensors");
});

device.on("message", async (topic, payload) => {
  console.log("Message received:", topic, payload.toString());

  try {
    const payloadData = JSON.parse(payload.toString());
    console.log("Payload data parsed:", payloadData); // Debugging log

    if (topic === "esp32/sensors") {
      // Expecting payloadData to be an object with a 'distance' field
      if (payloadData.distance !== undefined) {
        const sensorData = new SensorData({
          distance: payloadData.distance,
          timestamp: new Date(), // Using current time as timestamp
        });
        await sensorData.save();
        console.log("Sensor data saved to MongoDB");
      } else {
        console.log("Invalid sensor data received:", payloadData);
      }
    } else if (topic === "apm/device/events") {
      // Assuming Event model can handle the entire payload
      const eventData = new Event(payloadData);
      await eventData.save();
      console.log("Event data saved to MongoDB");
    }
  } catch (error) {
    console.error("Error processing MQTT message:", error);
  }
});

module.exports = device;
