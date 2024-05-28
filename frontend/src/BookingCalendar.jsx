import React, { useEffect, useState } from "react";
import { addDays, isWithinInterval } from "date-fns";
import { DateRange } from "react-date-range";
import BookingPopUp from "./BookingPopUp";

import "react-date-range/dist/styles.css"; // main style file
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

  // Function is triggered when user selects a date range. The item is the date range.
  const handleDaysSelect = (item) => {
    setRange([item.selection]); // updates selected range in state
    setDaysSelected(item.selection.startDate && item.selection.endDate); // Set daysSelected based on whether startDate and endDate are selected
  };

  const handleReserveClick = () => {
    setShowPopUp(true);
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

  const isDateUnavailable = (date) => {
    return unavailableDates.some((range) =>
      isWithinInterval(date, { start: range.startDate, end: range.endDate })
    );
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
        disabledDates={unavailableDates.flatMap((range) => {
          const dates = [];
          let currentDate = new Date(range.startDate);
          while (currentDate <= range.endDate) {
            dates.push(new Date(currentDate));
            currentDate = addDays(currentDate, 1);
          }
          return dates;
        })}
      />

      <div>
        {daysSelected && (
          <button className="reserveButton" onClick={handleReserveClick}>
            Reserve
          </button>
        )}
      </div>

      {showPopUp && (
        <BookingPopUp onClose={closePopUp} selectedRange={range[0]} />
      )}
    </div>
  );
};

export default BookingCalendar;
