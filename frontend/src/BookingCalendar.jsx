import React, { useEffect, useState } from "react";
import { addDays } from "date-fns";
import { DateRange } from "react-date-range";
import BookingPopUp from "./BookingPopUp";
import axios from "axios";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

const BookingCalendar = ({ unavailableDates }) => {
  // date state
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const [daysSelected, setDaysSelected] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);

  const apiURL = import.meta.env.VITE_API_URL;
  // console.log("API URL:", apiURL); // Should print /api

  // Function is triggered when user selects a date range. The item is the date range.
  const handleDaysSelect = (item) => {
    setRange([item.selection]); // updates selected range in state
    setDaysSelected(item.selection.startDate && item.selection.endDate); // Set daysSelected based on whether startDate and endDate are selected
  };

  const handleReserveClick = async () => {
    try {
      await axios.post(`${apiURL}/unavailable-dates`, {
        startDate: range[0].startDate,
        endDate: range[0].endDate,
      });
      setShowPopUp(true);
    } catch (error) {
      console.error("Error reserving dates:", error);
    }
  };

  const handleResetDates = async () => {
    try {
      await axios.delete(`${apiURL}/unavailable-dates`);
      window.location.reload(); // Refresh the page to fetch updated dates
    } catch (error) {
      console.error("Error resetting dates:", error);
    }
  };

  const closePopUp = () => {
    setShowPopUp(false);
  };

  useEffect(() => {
    if (daysSelected) {
      const button = document.querySelector(".reserveButton");
      if (button) {
        button.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [daysSelected]);

  const getDisabledDates = () => {
    if (!Array.isArray(unavailableDates)) {
      console.error("unavailableDates is not an array:", unavailableDates);
      return [];
    }

    return unavailableDates
      .map((range) => {
        const dates = [];
        let currentDate = new Date(range.startDate);
        while (currentDate <= new Date(range.endDate)) {
          dates.push(new Date(currentDate));
          currentDate = addDays(currentDate, 1);
        }
        return dates;
      })
      .flat();
  };

  return (
    <div className="calendarWrap">
      <DateRange
        editableDateInputs={true}
        onChange={handleDaysSelect}
        moveRangeOnFirstSelection={false}
        ranges={range}
        months={3}
        className="calendarElement"
        direction="horizontal"
        minDate={new Date()}
        disabledDates={getDisabledDates()}
      />

      <div>
        {daysSelected && (
          <button className="reserveButton" onClick={handleReserveClick}>
            Reserve
          </button>
        )}
        <button className="resetButton" onClick={handleResetDates}>
          Reset Dates
        </button>
      </div>
      {showPopUp && (
        <BookingPopUp onClose={closePopUp} selectedRange={range[0]} />
      )}
    </div>
  );
};

export default BookingCalendar;
