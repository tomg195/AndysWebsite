import React, { useEffect, useState } from "react";
import { format, differenceInDays } from "date-fns";
import { calcTotalPrice } from "../../../Pricing.js";
import useEscapeKeyPress from "../../../useEscapeKeyPress.js";
import BookingSummary from "../BookingSummary/BookingSummary";

const BookingPopUp = ({ onClose, selectedRange }) => {
  const [people, setPeople] = useState(1);
  const [pets, setPets] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showSummary, setShowSummary] = useState(false); // State to show BookingSummary

  useEscapeKeyPress(onClose);

  useEffect(() => {
    const nights = differenceInDays(
      selectedRange.endDate,
      selectedRange.startDate
    );
    const newTotalPrice = calcTotalPrice(people, pets, nights);
    setTotalPrice(newTotalPrice);
  }, [people, pets, selectedRange]);

  const formatDate = (date) => {
    return format(date, "EEE, d MMM");
  };

  const handlePeopleChange = (event) => {
    setPeople(parseInt(event.target.value));
  };

  const handlePetsChange = (event) => {
    setPets(parseInt(event.target.value));
  };

  const handleContinue = () => {
    setShowSummary(true); // Show BookingSummary instead of navigating
  };

  const handleCloseSummary = () => {
    setShowSummary(false); // Close BookingSummary and return to BookingPopUp
  };

  return (
    <div>
      {showSummary ? (
        <BookingSummary
          onClose={handleCloseSummary}
          selectedRange={selectedRange}
          people={people}
          pets={pets}
          totalPrice={totalPrice}
        />
      ) : (
        <div>
          <div className="popUpOverlay" onClick={onClose}></div>
          <div className="popUp">
            <div className="header">
              <h4>Your Booking</h4>
              <span className="closeButton1" onClick={onClose}>
                X
              </span>
            </div>

            <h5>
              Dates: {formatDate(selectedRange.startDate)} -{" "}
              {formatDate(selectedRange.endDate)}
            </h5>

            <div className="peopleAndPets">
              <h5 className="peopleSelect">People:</h5>
              <select
                className="boxOption"
                value={people}
                onChange={handlePeopleChange}
              >
                {[...Array(10)].map((_, index) => (
                  <option key={index} value={index + 1} className="numberStyle">
                    {index + 1}
                  </option>
                ))}
              </select>

              <h5 className="petSelect">Pets:</h5>
              <select
                className="boxOption"
                value={pets}
                onChange={handlePetsChange}
              >
                {[...Array(6)].map((_, index) => (
                  <option key={index} value={index} className="numberStyle">
                    {index}
                  </option>
                ))}
              </select>
            </div>

            <div className="priceSection">
              <h5>Total price: £{totalPrice}</h5>
            </div>

            <button className="reserveButton" onClick={handleContinue}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPopUp;
