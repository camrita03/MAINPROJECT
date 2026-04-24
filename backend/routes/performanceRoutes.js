const express = require("express");
const {
  getPerformance,
  updateStepValue,
  switchTrackingMode
} = require("../controllers/performanceController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getPerformance);
router.post("/update-step", protect, updateStepValue);
router.post("/mode", protect, switchTrackingMode);

module.exports = router;
