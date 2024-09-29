const FanState = require("../models/fanStateModel");
const { publishFanControl } = require("../config/mqtt");

exports.toggleFan = async (req, res) => {
  try {
    const { state } = req.body;

    // Publish the fan control message
    publishFanControl(state);

    // Update the fan state in the database
    const fanState = new FanState({ state });
    await fanState.save();

    res.json({ message: "Fan state updated successfully", state });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFanState = async (req, res) => {
  try {
    const latestState = await FanState.findOne().sort({ timestamp: -1 });
    res.json({ state: latestState ? latestState.state : false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
