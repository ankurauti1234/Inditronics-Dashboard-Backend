// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isAuthenticated, authorizeRoles } = require("../middlewares/authMiddleware");

router.get("/", isAuthenticated, authorizeRoles(["Admin", "Moderator"]), userController.getUsers);
router.post("/", isAuthenticated, authorizeRoles(["Admin"]), userController.createUser);
router.put("/:id", isAuthenticated, authorizeRoles(["Admin"]), userController.updateUser);
router.delete("/:id", isAuthenticated, authorizeRoles(["Admin"]), userController.deleteUser);

module.exports = router;