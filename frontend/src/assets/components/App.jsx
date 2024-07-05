import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookingSummary from "./BookingSummary";
import CheckoutConfirmation from "./CheckoutConfirmation";
import HomePage from "./HomePage";
import axios from "axios";

function App() {
  const [unavailableDates, setUnavailableDates] = useState([]);

  const fetchUnavailableDates = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/unavailable-dates"
      );
      const data = response.data;
      console.log("Fetched unavailable dates:", data);
      setUnavailableDates(data);
    } catch (error) {
      console.error("Error fetching unavailable dates:", error);
    }
  };

  useEffect(() => {
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
          element={
            <HomePage
              unavailableDates={unavailableDates}
              setUnavailableDates={setUnavailableDates}
            />
          }
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
