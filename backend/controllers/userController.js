const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// ✅ TOKEN FUNCTION
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// REGISTER
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("📝 REGISTRATION ATTEMPT:", { name, email });

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      console.log("❌ REGISTRATION FAILED: User already exists", normalizedEmail);
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password, // Storing plain text as requested
    });

    console.log("✅ REGISTRATION SUCCESSFUL:", user.email);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileCompleted: user.profileCompleted,
      resumeUploaded: user.resumeUploaded,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("🔥 REGISTRATION ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("🔑 LOGIN ATTEMPT:", { email, passwordReceived: !!password });

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    console.log("🔍 USER LOOKUP:", user ? "User Found" : "User Not Found");

    if (user) {
      console.log("🔄 COMPARING PASSWORDS:");
      console.log("   Received:", password);
      console.log("   Stored:", user.password);

      if (user.password === password) {
        console.log("✅ LOGIN SUCCESSFUL:", user.email);
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          profileCompleted: user.profileCompleted,
          resumeUploaded: user.resumeUploaded,
          token: generateToken(user._id),
        });
      } else {
        console.log("❌ LOGIN FAILED: Wrong Password");
        return res.status(401).json({ message: "Invalid password" });
      }
    } else {
      console.log("❌ LOGIN FAILED: Email not registered");
      return res.status(401).json({ message: "Email not registered" });
    }

  } catch (error) {
    console.error("🔥 LOGIN ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// GET USER PROFILE
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileCompleted: user.profileCompleted,
        resumeUploaded: user.resumeUploaded,
        profileData: user.profileData,
        targetRole: user.targetRole,
        analysis: user.analysis,
        performance: user.performance,
        trackingMode: user.trackingMode,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (user) {
      user.profileData = req.body.profileData || user.profileData;
      user.targetRole = req.body.targetRole || user.targetRole;
      user.profileCompleted = true;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        profileCompleted: updatedUser.profileCompleted,
        profileData: updatedUser.profileData,
        targetRole: updatedUser.targetRole,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PROGRESS
const updateProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { progress, completedSteps } = req.body;
    
    if (user.progressTracking) {
      if (progress !== undefined) user.progressTracking.progress = progress;
      if (completedSteps !== undefined) user.progressTracking.completedSteps = completedSteps;
    }

    await user.save();
    res.json({ message: "Progress updated", progressTracking: user.progressTracking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SWITCH MODE
const switchMode = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { mode } = req.body;
    if (mode && ["auto", "manual"].includes(mode)) {
      user.progressTracking.mode = mode;
    }

    await user.save();
    res.json({ message: "Mode updated", mode: user.progressTracking.mode });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateProfile,
  updateProgress,
  switchMode 
};
