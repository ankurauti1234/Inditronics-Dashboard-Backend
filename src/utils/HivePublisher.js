const mqtt = require("mqtt");

// MQTT broker connection details
const brokerUrl =
  "mqtts://392cbf95c94b427ab9f14d4f4d39751b.s1.eu.hivemq.cloud:8883";
const username = "ankur";
const password = "Ankur@123";
const topic = "sensor/data";

// Function to generate dummy sensor data
function generateSensorData() {
  const temperature = Math.floor(Math.random() * 100);
  const humidity = Math.floor(Math.random() * 100);
  return { temperature, humidity };
}

// Connect to the MQTT broker
const client = mqtt.connect(brokerUrl, {
  username: username,
  password: password,
  protocol: "mqtts",
  port: 8883,
  rejectUnauthorized: true,
  connectTimeout: 5000,
});

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  // Publish dummy sensor data every 5 seconds
  setInterval(() => {
    const data = generateSensorData();
    const message = JSON.stringify(data);
    client.publish(topic, message);
    console.log(`Published: ${message}`);
  }, 5000);
});

client.on("error", (err) => {
  console.error("Error:", err);
});
