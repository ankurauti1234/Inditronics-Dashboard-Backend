const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

router.get('/live', sensorController.getLiveSensorData);

module.exports = router;