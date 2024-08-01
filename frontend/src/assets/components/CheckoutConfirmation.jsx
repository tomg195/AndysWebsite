import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import axios from "axios";

const CheckoutConfirmation = ({ updateUnavailableDates }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedRange, people, pets, totalPrice } = location.state || {};
  const apiURL = import.meta.env.VITE_API_URL;

  const formatDate = (date) => {
    try {
      return format(date, "EEE, d MMM");
    } catch (error) {
      console.error("Invalid date value:", date);
      return "Invalid date";
    }
  };

  const handleConfirmBooking = async () => {
    try {
      // Ensure dates are handled in local time without time conversion
      const startDate = format(new Date(selectedRange.startDate), "yyyy-MM-dd");
      const endDate = format(new Date(selectedRange.endDate), "yyyy-MM-dd");

      await axios.post(`${apiURL}/unavailable-dates`, {
        startDate: `${startDate}T00:00:00.000Z`,
        endDate: `${endDate}T23:59:59.999Z`,
      });
      updateUnavailableDates(selectedRange); // Assuming this updates the state in a parent component or context
      navigate("/");
    } catch (error) {
      console.error("Error confirming booking:", error);
    }
  };

  return (
    <div className="checkout-confirmation">
      <h4>Checkout Confirmation</h4>
      <div className="checkout-details">
        <p>
          Dates: {formatDate(new Date(selectedRange.startDate))} -{" "}
          {formatDate(new Date(selectedRange.endDate))}
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
