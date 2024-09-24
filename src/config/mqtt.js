const awsIot = require("aws-iot-device-sdk");
const { awsIotConfig } = require("./index");
const SensorData = require("../models/sensorDataModel");
const Event = require("../models/eventsModel");
const path = require("path");
const fs = require("fs");

// Log the current working directory
console.log("Current working directory:", process.cwd());

// Function to check if a file exists and is readable
function checkFile(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    console.log(`File exists and is readable: ${filePath}`);
    return true;
  } catch (err) {
    console.error(`Error accessing file: ${filePath}`, err);
    return false;
  }
}

// Log and validate the AWS IoT configuration
console.log("AWS IoT Configuration:", JSON.stringify(awsIotConfig, null, 2));

// Check each file path in the configuration
["keyPath", "certPath", "caPath"].forEach((key) => {
  if (awsIotConfig[key]) {
    const absolutePath = path.resolve(awsIotConfig[key]);
    console.log(`${key} absolute path:`, absolutePath);
    checkFile(absolutePath);
    // Update the config with the absolute path
    awsIotConfig[key] = absolutePath;
  }
});

// Attempt to create the device with error handling
let device;
try {
  device = awsIot.device(awsIotConfig);
  console.log("Device created successfully");
} catch (error) {
  console.error("Error creating device:", error);
  process.exit(1);
}

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
