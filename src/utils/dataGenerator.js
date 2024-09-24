const TempData = require("../models/tempModel");
const { DateTime } = require("luxon");

async function generateSyntheticData(limit = 200) {
  let realTemperature = 200;
  let predictionTemperature = 200;
  let realConveyorSpeed = 1.2;
  let predictionConveyorSpeed = 1.2;
  const upperLimit = 210;
  const lowerLimit = 190;

  let dataCounter = 0;
  let realInIncreasingTrend = false;
  let realInDecreasingTrend = false;
  let predictionInIncreasingTrend = false;
  let predictionInDecreasingTrend = false;

  const generateDataPoint = async () => {
    if (dataCounter >= limit) {
      console.log("Data generation completed.");
      return;
    }

    const realTimestamp = DateTime.now();
    const predictionTimestamp = realTimestamp.plus({ seconds: 5 });

    // Generate real-time data
    if (realInIncreasingTrend) {
      realTemperature += 0.4;
      if (realTemperature >= upperLimit) {
        realInIncreasingTrend = false;
      }
    } else if (realInDecreasingTrend) {
      realTemperature -= 0.4;
      if (realTemperature <= lowerLimit) {
        realInDecreasingTrend = false;
      }
    } else if (20 <= dataCounter && dataCounter < 28) {
      realTemperature += 0.5;
      if (dataCounter === 27) {
        realInIncreasingTrend = true;
      }
    } else if (50 <= dataCounter && dataCounter < 56) {
      realTemperature -= 0.4;
      if (dataCounter === 55) {
        realInDecreasingTrend = true;
      }
    } else if (90 <= dataCounter && dataCounter < 96) {
      realTemperature += 0.5;
    } else if (130 <= dataCounter && dataCounter < 136) {
      if (dataCounter % 2 === 0) {
        realTemperature += 0.3;
      } else {
        realTemperature -= 0.1;
      }
    } else if (170 <= dataCounter && dataCounter < 176) {
      realTemperature += 0.3;
      realConveyorSpeed -= 0.02;
    } else {
      realTemperature += Math.random() * 0.2 - 0.1;
      realConveyorSpeed += Math.random() * 0.02 - 0.01;
    }

    // Generate prediction data (5 seconds ahead) with different logic
    if (predictionInIncreasingTrend) {
      predictionTemperature += 0.5;
      if (predictionTemperature >= upperLimit + 2) {
        predictionInIncreasingTrend = false;
      }
    } else if (predictionInDecreasingTrend) {
      predictionTemperature -= 0.5;
      if (predictionTemperature <= lowerLimit - 2) {
        predictionInDecreasingTrend = false;
      }
    } else if (15 <= dataCounter && dataCounter < 25) {
      predictionTemperature += 0.6;
      if (dataCounter === 24) {
        predictionInIncreasingTrend = true;
      }
    } else if (45 <= dataCounter && dataCounter < 53) {
      predictionTemperature -= 0.5;
      if (dataCounter === 52) {
        predictionInDecreasingTrend = true;
      }
    } else if (85 <= dataCounter && dataCounter < 93) {
      predictionTemperature += 0.6;
    } else if (125 <= dataCounter && dataCounter < 133) {
      if (dataCounter % 2 === 0) {
        predictionTemperature += 0.4;
      } else {
        predictionTemperature -= 0.2;
      }
    } else if (165 <= dataCounter && dataCounter < 173) {
      predictionTemperature += 0.4;
      predictionConveyorSpeed -= 0.03;
    } else {
      predictionTemperature += Math.random() * 0.3 - 0.15;
      predictionConveyorSpeed += Math.random() * 0.03 - 0.015;
    }

    dataCounter += 1;

    const realDataPoint = new TempData({
      Timestamp: realTimestamp.toJSDate(),
      Temperature: realTemperature,
      Conveyor_Speed: realConveyorSpeed,
      isPrediction: false,
    });

    const predictionDataPoint = new TempData({
      Timestamp: predictionTimestamp.toJSDate(),
      Temperature: predictionTemperature,
      Conveyor_Speed: predictionConveyorSpeed,
      isPrediction: true,
    });

    await realDataPoint.save();
    await predictionDataPoint.save();

    console.log("Real:", realDataPoint);
    console.log("Prediction:", predictionDataPoint);

    setTimeout(generateDataPoint, 1000);
  };

  generateDataPoint();
}

module.exports = { generateSyntheticData };
