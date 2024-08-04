import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import axios from "axios";
import "./CheckoutConfirmation.css";
import { FaHome } from "react-icons/fa"; // Import the home icon from react-icons

const CheckoutConfirmation = ({ updateUnavailableDates }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedRange, people, pets, totalPrice, contactData, guestData } =
    location.state || {};
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
      const startDate = format(new Date(selectedRange.startDate), "yyyy-MM-dd");
      const endDate = format(new Date(selectedRange.endDate), "yyyy-MM-dd");

      await axios.post(`${apiURL}/unavailable-dates`, {
        startDate: `${startDate}T00:00:00.000Z`,
        endDate: `${endDate}T23:59:59.999Z`,
      });
      updateUnavailableDates(selectedRange);

      await axios.post(`${apiURL}/send-confirmation-email`, {
        contactData,
        guestData,
        selectedRange: {
          startDate: selectedRange.startDate.toISOString(),
          endDate: selectedRange.endDate.toISOString(),
        },
        people,
        pets,
        totalPrice,
      });

      navigate("/");
    } catch (error) {
      console.error("Error confirming booking:", error);
    }
  };

  return (
    <div className="checkout-confirmation">
      <div className="header">
        <button className="home-button" onClick={() => navigate("/")}>
          <FaHome size={40} />
        </button>
        <h4>Checkout Confirmation</h4>
      </div>
      <div className="checkout-details">
        <p>
          Dates: {formatDate(new Date(selectedRange.startDate))} -{" "}
          {formatDate(new Date(selectedRange.endDate))}
        </p>
        <p>People: {people}</p>
        <p>Pets: {pets}</p>
        <p>Total Price: £{totalPrice}</p>
        <div className="payment-instructions">
          <p>
            If you are happy and certain of the days you have selected, please
            make a bank transfer to Andy. His details are as follows:
          </p>
          <div className="bank-details">
            <p>Mr Andrew M Harding</p>
            <p>Sort code: 11-03-36</p>
            <p>Account number: 10593265</p>
          </div>
          <p>
            Once you have made the transfer please click the 'Confirm booking'
            button. Andy will be automatically notified of your booking, and you
            will receive confirmation of your booking.
          </p>
        </div>
      </div>
      <p>
        Note: Please ONLY click 'Confirm booking' when you have transferred the
        above amount to Andy
      </p>
      <button className="proceed-button" onClick={handleConfirmBooking}>
        Confirm booking
      </button>
    </div>
  );
};

export default CheckoutConfirmation;
