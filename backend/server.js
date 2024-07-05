const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

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
  startDate: Date,
  endDate: Date,
});

const UnavailableDate = mongoose.model("UnavailableDate", dateSchema);

// API Routes
app.get("/unavailable-dates", async (req, res) => {
  const dates = await UnavailableDate.find();
  res.json(dates);
});

app.post("/unavailable-dates", async (req, res) => {
  const { startDate, endDate } = req.body;
  const newDate = new UnavailableDate({ startDate, endDate });
  await newDate.save();
  res.json(newDate);
});

app.delete("/unavailable-dates/:id", async (req, res) => {
  const { id } = req.params;
  await UnavailableDate.findByIdAndDelete(id);
  res.json({ message: "Date removed" });
});

// Endpoint to clear all unavailable dates
app.delete("/unavailable-dates", async (req, res) => {
  await UnavailableDate.deleteMany({});
  res.json({ message: "All unavailable dates cleared" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
