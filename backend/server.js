const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
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

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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

app.post("/send-confirmation-email", async (req, res) => {
  const { contactData, guestData, selectedRange, people, pets, totalPrice } =
    req.body;

  const hostEmail = "gardner195@msn.com";
  const userEmail = contactData.email;

  const mailOptions = {
    from: process.env.EMAIL,
    to: [hostEmail, userEmail],
    subject: "Booking Confirmation",
    text: `
      Booking Details:
      Dates: ${selectedRange.startDate} - ${selectedRange.endDate}
      People: ${people}
      Pets: ${pets}
      Total Price: £${totalPrice}

      Contact Details:
      Title: ${contactData.title}
      First Name: ${contactData.firstname}
      Last Name: ${contactData.lastname}
      Address 1: ${contactData.address1}
      Address 2: ${contactData.address2}
      City/Town: ${contactData.cityTown}
      Postcode: ${contactData.postcode}
      County: ${contactData.county}
      Email: ${contactData.email}
      Mobile: ${contactData.mobile}

      Guest Details:
      ${guestData
        .map(
          (guest, index) =>
            `Guest ${index + 1}: ${guest.firstname} ${guest.lastname}`
        )
        .join("\n")}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending email", error });
    } else {
      res.status(200).json({ message: "Confirmation email sent", info });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
