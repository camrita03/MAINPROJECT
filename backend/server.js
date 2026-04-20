const express = require('express')
const dotenv = require('dotenv')

const cors = require('cors')
const connectDB = require("./config/db")

// Import Routes
const authRoutes = require("./routes/authRoutes");
const resumeRouter = require("./routes/resumeRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main simple route
app.get('/', (req, res) => {
  res.send('Yogyata API is running...');
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRouter);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
