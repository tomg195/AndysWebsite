import React, { useEffect } from "react";

const BookingPopUp = ({ onClose }) => {
  document.body.classList.add("popUp-open");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="popUpContainer">
      <div className="popUpOverlay"></div>
      <div className="popUp">
        <h3>Your Booking</h3>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default BookingPopUp;
