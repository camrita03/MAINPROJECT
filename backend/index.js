const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const aiRoutes = require("./routes/aiRoutes");
const connectDB = require("./connection");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const performanceRoutes = require("./routes/performanceRoutes");
const jobRoutes = require("./routes/jobRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/jobs", jobRoutes);
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});