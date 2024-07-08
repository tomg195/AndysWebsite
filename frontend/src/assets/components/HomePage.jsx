import { useState, useEffect } from "react";
import BookingCalendar from "./BookingCalendar";
import ImageSlider from "./ImageSlider";
import axios from "axios";

function HomePage({ unavailableDates, setUnavailableDates }) {
  const [password, setPassword] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [startDateToDelete, setStartDateToDelete] = useState("");
  const [endDateToDelete, setEndDateToDelete] = useState("");

  const apiURL = import.meta.env.VITE_API_URL;

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

  const handleDeleteSpecificDate = async () => {
    try {
      const response = await axios.delete(`${apiURL}/unavailable-dates`, {
        data: {
          password,
          startDate: new Date(startDateToDelete).toISOString(),
          endDate: new Date(endDateToDelete).toISOString(),
        },
      });
      console.log(response.data); // Check the response from the server
      fetchUnavailableDates(); // Refresh the unavailable dates
    } catch (error) {
      console.error("Error deleting specific date:", error);
    }
  };

  const fetchUnavailableDates = async () => {
    try {
      const response = await axios.get(`${apiURL}/unavailable-dates`);
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

  const checkPassword = () => {
    if (password === "123") {
      setPasswordVerified(true);
    } else {
      alert("Incorrect password");
    }
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
      <div
        className="admin-login"
        style={{ position: "absolute", top: "10px", right: "10px" }}
      >
        {passwordVerified ? (
          <div>
            <input
              type="date"
              placeholder="Enter start date to delete"
              value={startDateToDelete}
              onChange={(e) => setStartDateToDelete(e.target.value)}
            />
            <input
              type="date"
              placeholder="Enter end date to delete"
              value={endDateToDelete}
              onChange={(e) => setEndDateToDelete(e.target.value)}
            />
            <button onClick={handleDeleteSpecificDate}>
              Delete Specific Date
            </button>
          </div>
        ) : (
          <div>
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={checkPassword}>Login</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
