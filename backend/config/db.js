const mongoose = require('mongoose');

const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const url = 'mongodb+srv://mmm:mmm@cluster0.gvyon.mongodb.net/mydb734?appName=Cluster0';

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log('database connected');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
};

module.exports = connectDB;