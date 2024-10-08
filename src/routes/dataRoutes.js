const express = require("express");
const router = express.Router();
const dataController = require("../controllers/dataController");

router.post("/generate", dataController.startDataGeneration);
router.get("/", dataController.getTempData);

module.exports = router;
