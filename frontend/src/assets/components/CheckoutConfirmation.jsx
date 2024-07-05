import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";

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
      Note: Please ONLY click 'Confirm booking' when you have transferred the
      above amount to Andy
      <button className="proceed-button" onClick={handleConfirmBooking}>
        Confirm booking
      </button>
    </div>
  );
};

export default CheckoutConfirmation;
