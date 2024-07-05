import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookingSummary from "./BookingSummary";
import CheckoutConfirmation from "./CheckoutConfirmation";
import BookingCalendar from "./BookingCalendar";
import ImageSlider from "./ImageSlider";

function HomePage({ unavailableDates }) {
  const images = [
    { url: "/IMG1.jpg" },
    { url: "/IMG2.jpg" },
    { url: "/IMG3.jpg" },
    { url: "/IMG4.jpg" },
    { url: "/IMG5.jpg" },
    { url: "/IMG6.jpg" },
    { url: "/IMG7.jpg" },
    { url: "/IMG8.jpg" },
    { url: "/IMG9.jpg" },
    { url: "/IMG10.jpg" },
    { url: "/IMG11.jpg" },
  ];

  const containerStyles = {
    width: "650px",
    height: "600px",
    margin: "0 auto",
  };

  return (
    <div>
      <div className="banner">
        <h1>Andy's holiday home</h1>
      </div>
      <div style={containerStyles}>
        <ImageSlider images={images} />
      </div>
      <h2>Pick your days:</h2>

      <div>
        <BookingCalendar unavailableDates={unavailableDates} />
      </div>
    </div>
  );
}

function App() {
  const [unavailableDates, setUnavailableDates] = useState([]);

  useEffect(() => {
    const fetchUnavailableDates = async () => {
      try {
        const response = await fetch("http://localhost:5000/unavailable-dates");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched unavailable dates:", data);
        setUnavailableDates(data);
      } catch (error) {
        console.error("Error fetching unavailable dates:", error);
      }
    };

    fetchUnavailableDates();
  }, []);

  const updateUnavailableDates = (newRange) => {
    setUnavailableDates((prevDates) => [...prevDates, newRange]);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<HomePage unavailableDates={unavailableDates} />}
        />
        <Route path="/book" element={<BookingSummary />} />
        <Route
          path="/checkout"
          element={
            <CheckoutConfirmation
              updateUnavailableDates={updateUnavailableDates}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
