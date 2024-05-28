import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import "./App.css";

const CheckoutConfirmation = ({ updateUnavailableDates }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedRange, people, pets, totalPrice } = location.state || {};

  const formatDate = (date) => {
    try {
      return format(date, "EEE, d MMM");
    } catch (error) {
      console.error("Invalid date value:", date);
      return "Invalid date";
    }
  };

  const handleConfirmBooking = () => {
    updateUnavailableDates(selectedRange);
    navigate("/");
  };

  if (!selectedRange || !selectedRange.startDate || !selectedRange.endDate) {
    return <div>Error: Missing booking information.</div>;
  }

  return (
    <div className="checkout-confirmation">
      <h4>Checkout Confirmation</h4>
      <div className="checkout-details">
        <p>
          Dates: {formatDate(selectedRange.startDate)} -{" "}
          {formatDate(selectedRange.endDate)}
        </p>
        <p>People: {people}</p>
        <p>Pets: {pets}</p>
        <p>Total Price: £{totalPrice}</p>
      </div>
      <button className="proceed-button" onClick={handleConfirmBooking}>
        Confirm booking
      </button>
    </div>
  );
};

export default CheckoutConfirmation;
