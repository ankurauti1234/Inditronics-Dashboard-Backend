const Event = require("../models/eventsModel");

// Mapping of Type to Event Name
const eventTypeMapping = {
  1: "LOCATION",
  2: "GUEST_REGISTRATION",
  3: "MEMBER_GUEST_DECLARATION",
  4: "CONFIGURATION",
  5: "TAMPER_ALARM",
  6: "SOS_ALARM",
  7: "BATTERY_ALARM",
  8: "METER_INSTALLATION",
  9: "VOLTAGE_STATS",
  10: "TEMPERATURE_STATS",
  11: "NTP_SYNC",
  12: "AUDIENCE_SESSION_CLOSE",
  13: "NETWORK_LATCH",
  14: "REMOTE_PAIRING",
  15: "REMOTE_ACTIVITY",
  16: "SIM_ALERT",
  17: "SYSTEM_ALARM",
  18: "SYSTEM_INFO",
  19: "CONFIG_UPDATE",
  20: "ALIVE",
  21: "METER_OTA",
  22: "BATTERY_VOLTAGE",
  23: "BOOT",
  24: "BOOT_V2",
  25: "STB",
  26: "DERIVED_TV_STATUS",
  27: "AUDIO_SOURCE",
};
const alertTypes = [5, 6, 7, 16, 17];


// Get All Data with Search and Pagination
exports.getAllEvents = async (req, res) => {
  try {
    const {
      DEVICE_ID,
      Type,
      eventName,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
    } = req.query;

    // Initialize query object
    const query = {};

    // Handle DEVICE_ID filtering
    if (DEVICE_ID) {
      if (DEVICE_ID.includes("-")) {
        const [minId, maxId] = DEVICE_ID.split("-").map(Number);
        query.DEVICE_ID = { $gte: minId, $lte: maxId };
      } else {
        query.DEVICE_ID = Number(DEVICE_ID);
      }
    }

    // Handle Type filtering
    if (Type) {
      const types = Type.split(",").map(Number);
      query.Type = { $in: types };
    }

    // Handle eventName filtering
    if (eventName) {
      const eventNames = eventName.split(",");
      const eventTypes = Object.entries(eventTypeMapping)
        .filter(([_, name]) => eventNames.includes(name))
        .map(([type, _]) => Number(type));

      if (eventTypes.length > 0) {
        if (query.Type) {
          query.Type.$in = query.Type.$in.filter((type) =>
            eventTypes.includes(type)
          );
        } else {
          query.Type = { $in: eventTypes };
        }
      }
    }

    // Handle date range filtering
    if (dateFrom || dateTo) {
      query.TS = {};
      if (dateFrom) {
        query.TS.$gte = Math.floor(new Date(dateFrom).getTime() / 1000);
      }
      if (dateTo) {
        query.TS.$lte = Math.floor(new Date(dateTo).getTime() / 1000);
      }
    }

    // Calculate pagination options
    const skip = (page - 1) * limit;
    const limitNumber = parseInt(limit, 10);

    // Fetch events with pagination and sorting by timestamp
    const events = await Event.find(query)
      .sort({ TS: -1 }) // Sort by timestamp in descending order
      .skip(skip)
      .limit(limitNumber)
      .lean(); // Convert Mongoose documents to plain JavaScript objects

    // Map events to add eventName
    const eventsWithNames = events.map((event) => ({
      ...event,
      eventName: eventTypeMapping[event.Type] || "Unknown Event",
    }));

    // Get total count of events for pagination
    const total = await Event.countDocuments(query);

    // Send response with events and pagination info
    res.json({
      page: parseInt(page, 10),
      limit: limitNumber,
      total,
      events: eventsWithNames,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Latest Data for Each DEVICE_ID with Each TYPE
exports.getLatestEvents = async (req, res) => {
  try {
    const { DEVICE_ID, Type, page = 1, limit = 10 } = req.query;

    const matchStage = {};

    // Handle DEVICE_ID filtering
    if (DEVICE_ID) {
      if (DEVICE_ID.includes("-")) {
        const [minId, maxId] = DEVICE_ID.split("-").map(Number);
        matchStage.DEVICE_ID = { $gte: minId, $lte: maxId };
      } else {
        matchStage.DEVICE_ID = Number(DEVICE_ID);
      }
    }

    // Handle Type filtering
    if (Type) {
      const typesArray = Type.split(",").map(Number);
      matchStage.Type = { $in: typesArray };
    }

    // Pagination parameters
    const skip = (page - 1) * limit;
    const limitNumber = parseInt(limit, 10);

    // Fetch events with pagination, sorting, and grouping by DEVICE_ID and Type
    const events = await Event.aggregate([
      { $match: matchStage },
      { $sort: { TS: -1 } }, // Sort by timestamp in descending order
      {
        $group: {
          _id: { DEVICE_ID: "$DEVICE_ID", Type: "$Type" },
          latestEvent: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$latestEvent" } },
      { $skip: skip }, // Skip for pagination
      { $limit: limitNumber }, // Limit the number of documents
    ]);

    // Add event names
    const eventsWithNames = events.map((event) => ({
      ...event,
      eventName: eventTypeMapping[event.Type] || "Unknown Event",
    }));

    // Get the total count for pagination
    const total = await Event.countDocuments(matchStage);

    // Send response with events and pagination info
    res.json({
      page: parseInt(page, 10),
      limit: limitNumber,
      total,
      events: eventsWithNames,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Latest Event by DEVICE_ID
exports.getLatestEventByDeviceId = async (req, res) => {
  try {
    const { DEVICE_ID } = req.params;

    if (!DEVICE_ID) {
      return res.status(400).json({ message: "DEVICE_ID is required" });
    }

    const latestEvent = await Event.aggregate([
      { $match: { DEVICE_ID: Number(DEVICE_ID) } },
      { $sort: { TS: -1 } },
      { $limit: 1 },
    ]);

    if (latestEvent.length === 0) {
      return res
        .status(404)
        .json({ message: "No events found for the given DEVICE_ID" });
    }

    const eventWithName = {
      ...latestEvent[0],
      eventName: eventTypeMapping[latestEvent[0].Type] || "Unknown Event",
    };

    res.json(eventWithName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Latest Alerts 
exports.getAlerts = async (req, res) => {
  try {
    const { DEVICE_ID, Type, AlertType, page = 1, limit = 10 } = req.query;

    const matchStage = {
      Type: { $in: alertTypes },
    };

    // Handle DEVICE_ID filter
    if (DEVICE_ID) {
      if (DEVICE_ID.includes("-")) {
        const [minId, maxId] = DEVICE_ID.split("-").map(Number);
        matchStage.DEVICE_ID = { $gte: minId, $lte: maxId };
      } else {
        matchStage.DEVICE_ID = Number(DEVICE_ID);
      }
    }

    // Handle Type filter if provided
    if (Type) {
      const typesArray = Type.split(",")
        .map(Number)
        .filter((type) => alertTypes.includes(type));
      if (typesArray.length > 0) {
        matchStage.Type = { $in: typesArray };
      }
    }

    // Handle AlertType filter
    if (AlertType) {
      const validAlertTypes = ["Generated", "Pending", "Resolved"];
      if (validAlertTypes.includes(AlertType)) {
        matchStage.AlertType = AlertType;
      }
    }

    // Calculate pagination options
    const skip = (page - 1) * limit;
    const limitNumber = parseInt(limit, 10);

    const events = await Event.aggregate([
      { $match: matchStage },
      { $sort: { TS: -1 } },
      { $skip: skip },
      { $limit: limitNumber },
    ]);

    const eventsWithNames = events.map((event) => ({
      ...event,
      eventName: eventTypeMapping[event.Type] || "Unknown Event",
    }));

    const totalAlerts = await Event.countDocuments(matchStage);

    res.json({
      page: parseInt(page, 10),
      limit: limitNumber,
      total: totalAlerts,
      events: eventsWithNames,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Alerts Count by Type, AlertType, and combined Type + AlertType
exports.alertsCount = async (req, res) => {
  try {
    const stages = [
      {
        $match: {
          Type: { $in: alertTypes },
        },
      },
      {
        $facet: {
          totalAlerts: [
            {
              $count: "total",
            },
          ],
          totalByType: [
            {
              $group: {
                _id: "$Type",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                type: "$_id",
                count: 1,
              },
            },
          ],
          totalByAlertType: [
            {
              $group: {
                _id: "$AlertType",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                alertType: "$_id",
                count: 1,
              },
            },
          ],
          totalByTypeAndAlertType: [
            {
              $group: {
                _id: { Type: "$Type", AlertType: "$AlertType" },
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                type: "$_id.Type",
                alertType: "$_id.AlertType",
                count: 1,
              },
            },
          ],
        },
      },
    ];

    const result = await Event.aggregate(stages);

    const totalAlerts = result[0].totalAlerts[0]?.total || 0;
    const totalByType = result[0].totalByType;
    const totalByAlertType = result[0].totalByAlertType;
    const totalByTypeAndAlertType = result[0].totalByTypeAndAlertType;

    const reshapedResponse = totalByTypeAndAlertType.reduce((acc, item) => {
      const { type, alertType, count } = item;

      if (!acc[type]) {
        acc[type] = {
          alert: eventTypeMapping[type], // Map the type to its name
          total: 0,
          generated: 0,
          pending: 0,
          resolved: 0,
        };
      }

      acc[type].total += count;

      if (alertType === "Generated") {
        acc[type].generated += count;
      } else if (alertType === "Pending") {
        acc[type].pending += count;
      } else if (alertType === "Resolved") {
        acc[type].resolved += count;
      }

      return acc;
    }, {});

    // Decrement total count by 1 for each alert type
    // Object.values(reshapedResponse).forEach((alert) => {
    //   if (alert.total > 0) {
    //     alert.total -= 1;
    //   }
    // });

    const formattedResponse = Object.values(reshapedResponse);

    res.json(formattedResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.saveEvent = async (eventData) => {
  try {
    const event = new Event(eventData);
    await event.save();
    console.log("Event saved successfully");
  } catch (error) {
    console.error("Error saving event:", error);
    throw error;
  }
};