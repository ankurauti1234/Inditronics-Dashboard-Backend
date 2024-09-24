const awsIot = require("aws-iot-device-sdk");
const { awsIotConfig } = require("./index");
const path = require("path");
const fs = require("fs");
const mqttController = require("../controllers/mqttController");

console.log("Current working directory:", process.cwd());

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

console.log("AWS IoT Configuration:", JSON.stringify(awsIotConfig, null, 2));

["keyPath", "certPath", "caPath"].forEach((key) => {
  if (awsIotConfig[key]) {
    const absolutePath = path.resolve(awsIotConfig[key]);
    console.log(`${key} absolute path:`, absolutePath);
    checkFile(absolutePath);
    awsIotConfig[key] = absolutePath;
  }
});

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
    console.log("Payload data parsed:", payloadData);

    await mqttController.saveMqttData(topic, payloadData);

    if (topic === "esp32/sensors") {
      console.log("Sensor data processed");
    } else if (topic === "apm/device/events") {
      console.log("Event data processed");
    }
  } catch (error) {
    console.error("Error processing MQTT message:", error);
  }
});

module.exports = device;
