const express = require("express");
const mqttDataModel = require("../models/mqttDataModel");

const router = express.Router();

router.get("/data", async (req, res) => {
  const data = await mqttDataModel.find();
  res.json(data);
});

module.exports = router;
