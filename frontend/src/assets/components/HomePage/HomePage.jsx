import { useState, useEffect } from "react";
import BookingCalendar from "../BookingCalendar/BookingCalendar";
import ImageSlider from "../ImageSlider";
import axios from "axios";
import { DateRange } from "react-date-range";
import { startOfDay, endOfDay, format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./HomePage.css";
import BookingPopUp from "../BookingPopUp/BookingPopUp";
import BookingSummary from "../BookingSummary/BookingSummary";

function HomePage({ unavailableDates, setUnavailableDates }) {
  const [password, setPassword] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [startDateToDelete, setStartDateToDelete] = useState("");
  const [endDateToDelete, setEndDateToDelete] = useState("");
  const [adminRange, setAdminRange] = useState([
    {
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
      key: "selection",
    },
  ]);

  const [showBookingPopUp, setShowBookingPopUp] = useState(false);
  const [showBookingSummary, setShowBookingSummary] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [people, setPeople] = useState(1);
  const [pets, setPets] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

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
          startDate: `${
            new Date(startDateToDelete).toISOString().split("T")[0]
          }T00:00:00.000Z`,
          endDate: `${
            new Date(endDateToDelete).toISOString().split("T")[0]
          }T23:59:59.999Z`,
        },
      });
      console.log(response.data); // Check the response from the server
      fetchUnavailableDates(); // Refresh the unavailable dates
    } catch (error) {
      console.error("Error deleting specific date:", error);
    }
  };

  const handleAddUnavailableDate = async () => {
    try {
      const response = await axios.post(`${apiURL}/unavailable-dates`, {
        startDate: format(
          adminRange[0].startDate,
          "yyyy-MM-dd'T'00:00:00.000'Z'"
        ),
        endDate: format(adminRange[0].endDate, "yyyy-MM-dd'T'23:59:59.999'Z'"),
      });
      console.log(response.data); // Check the response from the server
      fetchUnavailableDates(); // Refresh the unavailable dates
    } catch (error) {
      console.error("Error adding unavailable date:", error);
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

  const handleExitAdminPanel = () => {
    setPasswordVerified(false);
  };

  const handleOpenBookingPopUp = (range) => {
    setSelectedRange(range);
    setShowBookingPopUp(true);
  };

  const handleCloseAllPopUps = () => {
    setShowBookingPopUp(false);
    setShowBookingSummary(false);
  };

  const handleShowBookingSummary = (people, pets, totalPrice) => {
    setPeople(people);
    setPets(pets);
    setTotalPrice(totalPrice);
    setShowBookingPopUp(false); // Close BookingPopUp
    setShowBookingSummary(true); // Show BookingSummary
  };

  const handleBackToBookingPopUp = () => {
    setShowBookingSummary(false);
    setShowBookingPopUp(true);
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
        <BookingCalendar
          unavailableDates={unavailableDates}
          onSelectRange={handleOpenBookingPopUp}
        />
      </div>
      <div className="admin-login">
        {passwordVerified ? (
          <div className="admin-panel">
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

            <DateRange
              editableDateInputs={true}
              onChange={(item) => setAdminRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={adminRange}
              className="adminCalendar"
            />
            <div className="admin-buttons">
              <button onClick={handleAddUnavailableDate}>
                Add Unavailable Date
              </button>
              <button onClick={handleExitAdminPanel} className="exit-button">
                X
              </button>
            </div>
          </div>
        ) : (
          <div>
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  checkPassword();
                }
              }}
            />
            <button onClick={checkPassword}>Login</button>
          </div>
        )}
      </div>

      {showBookingPopUp && (
        <BookingPopUp
          selectedRange={selectedRange}
          onClose={handleCloseAllPopUps}
          onContinue={handleShowBookingSummary}
        />
      )}

      {showBookingSummary && (
        <BookingSummary
          selectedRange={selectedRange}
          people={people}
          pets={pets}
          totalPrice={totalPrice}
          onClose={handleCloseAllPopUps}
          onBack={handleBackToBookingPopUp}
        />
      )}
    </div>
  );
}

export default HomePage;
