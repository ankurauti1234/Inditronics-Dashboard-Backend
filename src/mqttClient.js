const mqtt = require("./config/mqtt");
const mqttMiddleware = require("./middlewares/mqttMiddleware");

mqtt.on("message", mqttMiddleware);
