const SensorData = require("../models/sensorDataModel");

exports.getLiveSensorData = async (req, res) => {
  try {
    const { page = 1, limit = 10, startTime, endTime } = req.query;
    let query = {};

    if (startTime && endTime) {
      query.timestamp = { $gte: new Date(startTime), $lte: new Date(endTime) };
    }

    const totalCount = await SensorData.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    const data = await SensorData.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("distance temperature humidity timestamp"); // Include the temperature and humidity fields

    res.json({
      data: data,
      currentPage: page,
      totalPages,
      totalCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
