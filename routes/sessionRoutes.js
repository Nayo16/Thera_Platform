const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware"); 
const {
  createSession,
  getSessionById,
  updateSessionStatus,
  getMySessions
} = require("../controllers/sessionController");

router.post("/", protect, createSession);

router.get("/:id", protect, getSessionById);

router.put("/:id", protect, updateSessionStatus);

router.get("/", protect, getMySessions);

module.exports = router;
