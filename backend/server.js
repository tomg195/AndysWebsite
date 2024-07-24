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
  res.json(
    dates.map((date) => ({
      startDate: date.startDate.toISOString().split("T")[0],
      endDate: date.endDate.toISOString().split("T")[0],
    }))
  );
});

app.post("/unavailable-dates", async (req, res) => {
  const { startDate, endDate } = req.body;
  const newDate = new UnavailableDate({
    startDate: new Date(startDate).setUTCHours(0, 0, 0, 0),
    endDate: new Date(endDate).setUTCHours(23, 59, 59, 999),
  });
  await newDate.save();
  res.json(newDate);
});

app.delete("/unavailable-dates", async (req, res) => {
  const { password, startDate, endDate } = req.body;

  if (password === process.env.DELETE_PASSWORD) {
    const start = new Date(startDate).setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate).setUTCHours(23, 59, 59, 999);

    await UnavailableDate.deleteMany({
      $or: [
        { startDate: { $gte: new Date(start), $lte: new Date(end) } },
        { endDate: { $gte: new Date(start), $lte: new Date(end) } },
        {
          startDate: { $lte: new Date(start) },
          endDate: { $gte: new Date(end) },
        },
      ],
    });
    res.json({ message: "Date range removed" });
  } else {
    res.status(403).json({ message: "Incorrect password" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
