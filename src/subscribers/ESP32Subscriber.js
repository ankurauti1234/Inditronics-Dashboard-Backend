const mqtt = require('mqtt');

// Connect to HiveMQ's public broker
const client = mqtt.connect('mqtt://broker.hivemq.com:1883');

const topic = 'sensor/proximity';

// On connection, subscribe to the topic
client.on('connect', () => {
  console.log(`Connected to HiveMQ broker and subscribing to topic: ${topic}`);
  client.subscribe(topic, (err) => {
    if (!err) {
      console.log(`Successfully subscribed to ${topic}`);
    } else {
      console.error('Subscription error:', err);
    }
  });
});

// Continuously listen for incoming messages on the subscribed topic
client.on('message', (topic, message) => {
  console.log(`Message received on topic ${topic}: ${message.toString()}`);
});