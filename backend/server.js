const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { format } = require("date-fns");
require("dotenv").config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000;

// const allowedOrigins = [
//   // "http://localhost:5173", // Local development URL
//   // "https://andyhardingholidayhome.netlify.app",
//   "*",
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   optionsSuccessStatus: 200,
// };

// // Middleware
// app.use(bodyParser.json());
// app.use(cors(corsOptions)); // Enable CORS with specific options

const allowedOrigins = [
  "http://localhost:5173", // For local development
  "https://andyhardingholidayhome.netlify.app", // Production frontend URL
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Apply CORS with the updated options

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
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

  // Format dates
  const formattedStartDate = format(
    new Date(selectedRange.startDate),
    "EEEE, do MMMM"
  );
  const formattedEndDate = format(
    new Date(selectedRange.endDate),
    "EEEE, do MMMM"
  );

  // Email to host
  const hostMailOptions = {
    from: process.env.EMAIL,
    to: hostEmail,
    subject: "New Booking Confirmation",
    text: `
      Booking Details:
      Dates: ${formattedStartDate} - ${formattedEndDate}
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

  // Email to user
  const userMailOptions = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: "Booking Confirmation - Andy's Holiday Home",
    html: `
      <h1>Booking Confirmation</h1>
      <p>Thank you for booking! Here are your booking details:</p>
      <table>
        <tr>
          <th>Dates:</th>
          <td>${formattedStartDate} - ${formattedEndDate}</td>
        </tr>
        <tr>
          <th>People:</th>
          <td>${people}</td>
        </tr>
        <tr>
          <th>Pets:</th>
          <td>${pets}</td>
        </tr>
        <tr>
          <th>Total Price:</th>
          <td>£${totalPrice}</td>
        </tr>
      </table>
      <h2>Your Contact Details:</h2>
      <p>${contactData.title} ${contactData.firstname} ${
      contactData.lastname
    }</p>
      <p>${contactData.address1}, ${contactData.address2}</p>
      <p>${contactData.cityTown}, ${contactData.county}, ${
      contactData.postcode
    }</p>
      <p>Email: ${contactData.email}</p>
      <p>Mobile: ${contactData.mobile}</p>
      <h2>Your Guest Details:</h2>
      <ul>
        ${guestData
          .map(
            (guest, index) =>
              `<li>Guest ${index + 1}: ${guest.firstname} ${
                guest.lastname
              }</li>`
          )
          .join("")}
      </ul>
      <p>Please contact Andy if you have any questions about your stay</p>
    `,
  };

  try {
    await transporter.sendMail(hostMailOptions);
    await transporter.sendMail(userMailOptions);
    res.status(200).json({ message: "Confirmation emails sent" });
  } catch (error) {
    res.status(500).json({ message: "Error sending emails", error });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
