// src/controllers/mqttController.js

const MqttData = require("../models/mqttDataModel");

/**
 * Saves MQTT data to MongoDB.
 * @param {string} topic - The MQTT topic.
 * @param {Buffer|string} payload - The MQTT payload.
 * @returns {Promise<void>}
 */
exports.saveMqttData = async (topic, payload) => {
  try {
    // Ensure payload is a string
    const data = new MqttData({ topic, payload: payload.toString() });
    await data.save();
    console.log(`Data saved: Topic: ${topic}, Payload: ${payload.toString()}`);
  } catch (error) {
    console.error(`Error saving MQTT data. Topic: ${topic}`, error);
  }
};
