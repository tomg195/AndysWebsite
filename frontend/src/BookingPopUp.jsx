import React, { useEffect, useState } from "react";
import { format, differenceInDays } from "date-fns";
import { calcTotalPrice } from "./Pricing.js";
import useEscapeKeyPress from "./useEscapeKeyPress";
import { useNavigate } from "react-router-dom";

const BookingPopUp = ({ onClose, onBookNow, selectedRange }) => {
  const [people, setPeople] = useState(0);
  const [pets, setPets] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

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
    const selectedPeopleCount = parseInt(event.target.value);
    setPeople(selectedPeopleCount);
  };

  const handlePetsChange = (event) => {
    setPets(parseInt(event.target.value));
  };

  const handleBookNow = () => {
    navigate("/book", {
      state: {
        selectedRange,
        people,
        pets,
        totalPrice,
      },
    });
  };

  return (
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
              <option key={index} value={index} className="numberStyle">
                {index}
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

        <button className="reserveButton" onClick={handleBookNow}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default BookingPopUp;
