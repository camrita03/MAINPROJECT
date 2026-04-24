const express = require("express");
const { getRecommendedJobs } = require("../controllers/jobController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/recommendations", protect, getRecommendedJobs);

module.exports = router;
