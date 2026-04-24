const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfile,
  updateProgress,
  switchMode,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateProfile);
router.put("/progress", protect, updateProgress);
router.post("/mode", protect, switchMode);

module.exports = router;