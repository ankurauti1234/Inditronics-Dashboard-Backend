const awsIot = require("aws-iot-device-sdk");
const mongoose = require("mongoose");
const Event = require("../models/eventsModel"); // Path to your Event model
const { awsIotConfig, mongoURI } = require("../config/index"); // Import the configuration

// Connect to MongoDB using the URI from testing.js
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const device = awsIot.device(awsIotConfig);

// Event listener for successful connection to AWS IoT
device.on("connect", () => {
  console.log("Connected to AWS IoT");
  device.subscribe("apm/device/events"); // Subscribe to the topic
});

// Event listener for incoming messages
device.on("message", (topic, payload) => {
  console.log("Message received:", topic, payload.toString());

  // Parse the incoming message to a JavaScript object
  const message = JSON.parse(payload.toString());

  // Create a new Event document
  const event = new Event(message);

  // Save the event to MongoDB
  event.save((err) => {
    if (err) {
      console.error("Error saving event to MongoDB:", err);
    } else {
      console.log("Event successfully saved to MongoDB");
    }
  });
});
