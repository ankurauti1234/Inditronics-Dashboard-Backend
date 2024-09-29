const express = require("express");
const router = express.Router();
const sensorController = require("../controllers/sensorController");
const fanController = require("../controllers/fanController");

router.get("/sensor/live", sensorController.getLiveSensorData);
router.post("/fan/toggle", fanController.toggleFan);
router.get("/fan/state", fanController.getFanState);

module.exports = router;
