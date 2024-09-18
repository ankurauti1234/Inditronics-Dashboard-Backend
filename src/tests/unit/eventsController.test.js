const mongoose = require("mongoose");
const Event = require("../../models/eventsModel");
const eventsController = require("../../controllers/eventsController");

jest.mock("../../models/eventsModel");


describe("Events Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllEvents", () => {
    it("should return all events with pagination and filtering", async () => {
      req.query = {
        DEVICE_ID: "100-200",
        Type: "1,2",
        page: "2",
        limit: "5",
      };

      Event.find.mockResolvedValue([
        { DEVICE_ID: 150, Type: 1, TS: new Date() },
        { DEVICE_ID: 160, Type: 2, TS: new Date() },
      ]);
      Event.countDocuments.mockResolvedValue(10);

      await eventsController.getAllEvents(req, res);

      expect(Event.find).toHaveBeenCalledWith({
        DEVICE_ID: { $gte: 100, $lte: 200 },
        Type: { $in: [1, 2] },
      });
      expect(Event.countDocuments).toHaveBeenCalledWith({
        DEVICE_ID: { $gte: 100, $lte: 200 },
        Type: { $in: [1, 2] },
      });
      expect(res.json).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
        total: 10,
        events: expect.arrayContaining([
          expect.objectContaining({ eventName: "LOCATION" }),
          expect.objectContaining({ eventName: "GUEST_REGISTRATION" }),
        ]),
      });
    });

    it("should handle errors gracefully", async () => {
      Event.find.mockRejectedValue(new Error("Database error"));

      await eventsController.getAllEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("getLatestEvents", () => {
    it("should return the latest event for each DEVICE_ID and TYPE", async () => {
      req.query = {
        DEVICE_ID: "100",
        Type: "1",
        page: "1",
        limit: "5",
      };

      Event.aggregate.mockResolvedValue([
        { DEVICE_ID: 100, Type: 1, TS: new Date(), eventName: "LOCATION" },
      ]);
      Event.countDocuments.mockResolvedValue(1);

      await eventsController.getLatestEvents(req, res);

      expect(Event.aggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: { DEVICE_ID: 100, Type: { $in: [1] } },
          }),
          expect.objectContaining({ $sort: { TS: -1 } }),
          expect.objectContaining({ $group: expect.any(Object) }),
          expect.objectContaining({ $skip: 0 }),
          expect.objectContaining({ $limit: 5 }),
        ])
      );
      expect(res.json).toHaveBeenCalledWith({
        page: 1,
        limit: 5,
        total: 1,
        events: expect.arrayContaining([
          expect.objectContaining({ eventName: "LOCATION" }),
        ]),
      });
    });

    it("should handle errors gracefully", async () => {
      Event.aggregate.mockRejectedValue(new Error("Database error"));

      await eventsController.getLatestEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("getLatestEventByDeviceId", () => {
    it("should return the latest event for a specific DEVICE_ID", async () => {
      req.params.DEVICE_ID = "100";

      Event.aggregate.mockResolvedValue([
        { DEVICE_ID: 100, Type: 1, TS: new Date(), eventName: "LOCATION" },
      ]);

      await eventsController.getLatestEventByDeviceId(req, res);

      expect(Event.aggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ $match: { DEVICE_ID: 100 } }),
          expect.objectContaining({ $sort: { TS: -1 } }),
          expect.objectContaining({ $limit: 1 }),
        ])
      );
      expect(res.json).toHaveBeenCalledWith({
        DEVICE_ID: 100,
        Type: 1,
        TS: expect.any(Date),
        eventName: "LOCATION",
      });
    });

    it("should return 400 if DEVICE_ID is missing", async () => {
      await eventsController.getLatestEventByDeviceId(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "DEVICE_ID is required",
      });
    });

    it("should return 404 if no event is found", async () => {
      req.params.DEVICE_ID = "100";

      Event.aggregate.mockResolvedValue([]);

      await eventsController.getLatestEventByDeviceId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "No events found for the given DEVICE_ID",
      });
    });

    it("should handle errors gracefully", async () => {
      req.params.DEVICE_ID = "100";

      Event.aggregate.mockRejectedValue(new Error("Database error"));

      await eventsController.getLatestEventByDeviceId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("getAlerts", () => {
    it("should return alerts with pagination and filtering", async () => {
      req.query = {
        DEVICE_ID: "100-200",
        Type: "5,6",
        page: "1",
        limit: "5",
      };

      Event.aggregate.mockResolvedValue([
        { DEVICE_ID: 150, Type: 5, TS: new Date(), eventName: "TAMPER_ALARM" },
      ]);
      Event.countDocuments.mockResolvedValue(5);

      await eventsController.getAlerts(req, res);

      expect(Event.aggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: {
              DEVICE_ID: { $gte: 100, $lte: 200 },
              Type: { $in: [5, 6] },
            },
          }),
          expect.objectContaining({ $sort: { TS: -1 } }),
          expect.objectContaining({ $skip: 0 }),
          expect.objectContaining({ $limit: 5 }),
        ])
      );
      expect(res.json).toHaveBeenCalledWith({
        page: 1,
        limit: 5,
        total: 4, // Adjusted for the example
        events: expect.arrayContaining([
          expect.objectContaining({ eventName: "TAMPER_ALARM" }),
        ]),
      });
    });

    it("should handle errors gracefully", async () => {
      Event.aggregate.mockRejectedValue(new Error("Database error"));

      await eventsController.getAlerts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("alertsCount", () => {
    it("should return count of alerts grouped by type and alert type", async () => {
      Event.aggregate.mockResolvedValue([
        {
          totalAlerts: [{ total: 10 }],
          totalByType: [{ type: 5, count: 6 }],
          totalByAlertType: [{ alertType: "Generated", count: 4 }],
          totalByTypeAndAlertType: [
            { type: 5, alertType: "Generated", count: 4 },
          ],
        },
      ]);

      await eventsController.alertsCount(req, res);

      expect(Event.aggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: { Type: { $in: [5, 6, 7, 16, 17] } },
          }),
        ])
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            alert: "TAMPER_ALARM",
            total: 5,
            generated: 4,
            pending: 0,
            resolved: 0,
          }),
        ])
      );
    });

    it("should handle errors gracefully", async () => {
      Event.aggregate.mockRejectedValue(new Error("Database error"));

      await eventsController.alertsCount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });
});
