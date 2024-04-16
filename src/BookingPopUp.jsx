import React, { useEffect, useState } from "react";
import { format } from "date-fns";

const popUpOverlay = {
  position: "fixed",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
};

const popUp = {
  position: "absolute",
  backgroundColor: "white",
  height: "38rem",
  width: "30rem",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: "5px",
  fontSize: "30px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  // padding: "2rem",
};

const peopleAndPets = {
  display: "flex",
  alignItems: "center",
};

const peopleSelect = {
  marginRight: ".2rem",
};

const petSelect = {
  marginRight: ".2rem",
  marginLeft: "2rem",
};

const boxOption = {
  height: "40px",
  width: "60px",
};

const numberStyle = {
  // color: "black",
  fontSize: "15px",
};

const priceSection = {
  // marginBottom: "1rem",
};

const BookingPopUp = ({ onClose, selectedRange }) => {
  document.body.classList.add("popUp-open");

  const [people, setPeople] = useState(1);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove event listener when component unmounts
    return () => {
      document.body.classList.remove("popUp-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const formatDate = (date) => {
    return format(date, "EEE, d MMM");
  };

  const handlePeopleChange = (event) => {
    setPeople(parseInt(event.target.value));
  };

  return (
    <div>
      <div style={popUpOverlay}> </div>
      <div style={popUp}>
        <h3>Your Booking</h3>

        <h5>
          Dates: {formatDate(selectedRange.startDate)} -{" "}
          {formatDate(selectedRange.endDate)}
        </h5>

        <div style={peopleAndPets}>
          <h5 style={peopleSelect}>People:</h5>

          <select style={boxOption} onChange={handlePeopleChange}>
            {[...Array(10)].map((_, index) => (
              <option key={index} value={index + 1} style={numberStyle}>
                {index}
              </option>
            ))}
          </select>

          <h5 style={petSelect}>Pets:</h5>
          <select style={boxOption} onChange={handlePeopleChange}>
            {[...Array(6)].map((_, index) => (
              <option key={index} value={index + 1} style={numberStyle}>
                {index}
              </option>
            ))}
          </select>
        </div>

        <div style={priceSection}>
          <h5>Total price:</h5>
        </div>

        <button className="reserveButton" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default BookingPopUp;
