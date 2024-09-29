const awsIot = require("aws-iot-device-sdk");
const path = require("path");
const SensorData = require("../models/sensorDataModel");
const eventsController = require("../controllers/eventsController");
const FanState = require("../models/fanStateModel");

const awsIotConfig = {
  keyPath: path.resolve(__dirname, "./certs/test.private.pem.key"),
  certPath: path.resolve(__dirname, "./certs/test.cert.pem.crt"),
  caPath: path.resolve(__dirname, "./certs/root-CA.crt"),
  clientId: "inditronics-dev-client",
  host: "a3uoz4wfsx2nz3-ats.iot.ap-south-1.amazonaws.com",
};

const device = awsIot.device(awsIotConfig);

device.on("connect", () => {
  console.log("Connected to AWS IoT");
  device.subscribe("apm/device/events");
  device.subscribe("esp32/sensors");
});

device.on("message", async (topic, payload) => {
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
      // ... (previous event data handling code remains unchanged)
    } else if (topic === "fan/status") {
      // Handle fan status updates
      const fanState = new FanState({
        state: payloadData.state === 1,
      });
      await fanState.save();
      console.log("Fan state updated in MongoDB");
    } else {
      console.log("Unhandled topic:", topic);
    }
  } catch (error) {
    console.error("Error processing MQTT message:", error);
  }
});

// Function to publish fan control message
const publishFanControl = (state) => {
  const message = state === true ? "1" : "0";

  device.publish("fan/control", message, (err) => {
    if (err) {
      console.error("Error publishing fan control message:", err);
    } else {
      console.log("Fan control message published successfully");
      console.log(state);
      console.log(message);
    }
  });
};

module.exports = { device, publishFanControl };
