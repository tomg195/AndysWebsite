const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/booking", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dateSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const UnavailableDate = mongoose.model("UnavailableDate", dateSchema);

// API Routes
app.get("/unavailable-dates", async (req, res) => {
  const dates = await UnavailableDate.find();
  res.json(dates);
});

app.post("/unavailable-dates", async (req, res) => {
  const { startDate, endDate } = req.body;
  const newDate = new UnavailableDate({
    startDate: new Date(startDate).toISOString(),
    endDate: new Date(endDate).toISOString(),
  });
  await newDate.save();
  res.json(newDate);
});

// Delete a specific date range
app.delete("/unavailable-dates", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // 'Bearer TOKEN_HERE'

  if (token === process.env.ADMIN_TOKEN) {
    const { startDate, endDate } = req.body;

    const start = new Date(startDate).setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate).setUTCHours(23, 59, 59, 999);

    await UnavailableDate.deleteMany({
      startDate: { $gte: new Date(start) },
      endDate: { $lte: new Date(end) },
    });
    res.json({ message: "Date range removed" });
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
