const awsIot = require("aws-iot-device-sdk");
const path = require("path");

// Load AWS IoT Core configuration
const config = {
  awsIot: {
    host: "a3uoz4wfsx2nz3-ats.iot.ap-south-1.amazonaws.com",
    port: 8883,
    clientId: "inditronics-dev-client",
    certPath: path.resolve(__dirname, "../config/certs/test.cert.pem.crt"),
    keyPath: path.resolve(__dirname, "../config/certs/test.private.pem.key"),
    caPath: path.resolve(__dirname, "../config/certs/root-CA.crt"),
  },
};

// Initialize AWS IoT device
const device = awsIot.device({
  host: config.awsIot.host,
  port: config.awsIot.port,
  clientId: config.awsIot.clientId,
  certPath: config.awsIot.certPath,
  keyPath: config.awsIot.keyPath,
  caPath: config.awsIot.caPath,
});

// Function to generate random distance
function getRandomDistance() {
  return (Math.random() * 10).toFixed(2); // Distance between 0 and 10, rounded to 2 decimal places
}

// Connect to AWS IoT
device.on("connect", () => {
  console.log("Connected to AWS IoT");

  // Publish a message to the topic every 5 seconds
  setInterval(() => {
    const distance = getRandomDistance();
    const message = JSON.stringify({ distance });
    const topic = "esp32/sensors";

    device.publish(topic, message, (err) => {
      if (err) {
        console.error("Publish error:", err);
      } else {
        console.log(`Message published to topic ${topic}: ${message}`);
      }
    });
  }, 5000); // Publishing interval of 5 seconds
});

device.on("error", (error) => {
  console.error("AWS IoT error:", error);
});

device.on("offline", () => {
  console.log("AWS IoT connection offline");
});

device.on("reconnect", () => {
  console.log("Reconnecting to AWS IoT");
});
