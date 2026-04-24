const express = require("express");
const router = express.Router();

const { uploadResume } = require("../controllers/resumeController");
const protect = require("../middleware/authMiddleware");
const { checkProfileComplete } = require("../middleware/flowMiddleware");
const upload = require("../middleware/uploadmiddleware");

// 🔥 IMPORTANT: field name must be SAME as frontend
router.post(
  "/upload",
  protect,
  checkProfileComplete,
  upload.single("resume"),
  uploadResume
);

module.exports = router;