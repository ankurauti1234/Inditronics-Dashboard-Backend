const mqttController = require("../controllers/mqttController");

module.exports = (topic, payload) => {
  mqttController.saveMqttData(topic, payload);
};
