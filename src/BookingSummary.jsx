import React, { useEffect, useState } from "react";
import { format, differenceInDays } from "date-fns";
import useEscapeKeyPress from "./useEscapeKeyPress";

const BookingSummary = ({ onClose, selectedRange }) => {
  useEscapeKeyPress(onClose);

  return (
    <div>
      <div className="popUpOverlay" onClick={onClose}></div>
      <div className="popUp">
        <div className="header">
          <h3>Your Booking</h3>
          <span className="closeButton" onClick={onClose}>
            X
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;

