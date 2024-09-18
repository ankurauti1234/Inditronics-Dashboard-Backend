/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Operations related to events
 */

/**
 * @swagger
 * /api/events/:
 *   get:
 *     summary: Get All Data with Search and Pagination
 *     tags: [Events]
 *     parameters:
 *       - name: DEVICE_ID
 *         in: query
 *         description: Filter by device ID or range (e.g., "1-10").
 *         schema:
 *           type: string
 *       - name: Type
 *         in: query
 *         description: Filter by event type(s), comma-separated (e.g., "1,2,3").
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Page number for pagination.
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Number of items per page.
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Successful response with events and pagination info.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 events:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       DEVICE_ID:
 *                         type: integer
 *                       Type:
 *                         type: integer
 *                       TS:
 *                         type: string
 *                         format: date-time
 *                       eventName:
 *                         type: string
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/events/latest:
 *   get:
 *     summary: Get Latest Data for Each DEVICE_ID with Each TYPE
 *     tags: [Events]
 *     parameters:
 *       - name: DEVICE_ID
 *         in: query
 *         description: Filter by device ID or range (e.g., "1-10").
 *         schema:
 *           type: string
 *       - name: Type
 *         in: query
 *         description: Filter by event type(s), comma-separated (e.g., "1,2,3").
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Page number for pagination.
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Number of items per page.
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Successful response with latest events and pagination info.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 events:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       DEVICE_ID:
 *                         type: integer
 *                       Type:
 *                         type: integer
 *                       TS:
 *                         type: string
 *                         format: date-time
 *                       eventName:
 *                         type: string
 *       500:
 *         description: Internal server error.
 */


/**
 * @swagger
 * /api/events/latest/{DEVICE_ID}:
 *   get:
 *     summary: Get Latest Event by DEVICE_ID
 *     tags: [Events]
 *     parameters:
 *       - name: DEVICE_ID
 *         in: path
 *         required: true
 *         description: Device ID to get the latest event for.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with the latest event.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 DEVICE_ID:
 *                   type: integer
 *                 Type:
 *                   type: integer
 *                 TS:
 *                   type: string
 *                   format: date-time
 *                 eventName:
 *                   type: string
 *       400:
 *         description: DEVICE_ID is required.
 *       404:
 *         description: No events found for the given DEVICE_ID.
 *       500:
 *         description: Internal server error.
 */


/**
 * @swagger
 * /api/events/alerts:
 *   get:
 *     summary: Get Latest Alerts
 *     tags: [Events]
 *     parameters:
 *       - name: DEVICE_ID
 *         in: query
 *         description: Filter by device ID or range (e.g., "1-10").
 *         schema:
 *           type: string
 *       - name: Type
 *         in: query
 *         description: Filter by event type(s), comma-separated (e.g., "1,2,3").
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Page number for pagination.
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Number of items per page.
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Successful response with latest alerts and pagination info.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 events:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       DEVICE_ID:
 *                         type: integer
 *                       Type:
 *                         type: integer
 *                       TS:
 *                         type: string
 *                         format: date-time
 *                       eventName:
 *                         type: string
 *       500:
 *         description: Internal server error.
 */


/**
 * @swagger
 * /api/events/alertsCount:
 *   get:
 *     summary: Get Alerts Count by Type, AlertType, and combined Type + AlertType
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Successful response with alerts count data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   alert:
 *                     type: string
 *                   total:
 *                     type: integer
 *                   generated:
 *                     type: integer
 *                   pending:
 *                     type: integer
 *                   resolved:
 *                     type: integer
 *       500:
 *         description: Internal server error.
 */


const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventsController");

router.get("/", eventController.getAllEvents);

router.get("/latest", eventController.getLatestEvents);

router.get("/latest/:DEVICE_ID", eventController.getLatestEventByDeviceId);

router.get("/alerts", eventController.getAlerts);

router.get("/alertsCount", eventController.alertsCount);

module.exports = router;
