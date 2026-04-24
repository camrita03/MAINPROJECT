const express = require("express");
const router = express.Router();

const { analyzeWithAI } = require("../controllers/aicontroller");
const protect = require("../middleware/authMiddleware");
const { checkResumeUploaded } = require("../middleware/flowMiddleware");

router.post("/analyze", protect, checkResumeUploaded, analyzeWithAI);

module.exports = router;