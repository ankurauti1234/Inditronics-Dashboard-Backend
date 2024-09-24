const TempData = require("../models/tempModel");
const { generateSyntheticData } = require("../utils/dataGenerator");

exports.startDataGeneration = (req, res) => {
  const limit = req.body.limit || 200;
  generateSyntheticData(limit);
  res.json({
    message: "Data generation started for both prediction and real-time data",
  });
};

exports.getTempData = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const realData = await TempData.find({ isPrediction: false })
      .sort({ Timestamp: -1 })
      .limit(limit);

    const predictionData = await TempData.find({ isPrediction: true })
      .sort({ Timestamp: -1 })
      .limit(limit);

    res.json({
      realData,
      predictionData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
