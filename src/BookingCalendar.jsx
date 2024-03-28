import { useEffect, useState, useRef } from "react";
import { addDays, setDay } from "date-fns";
import { DateRange } from "react-date-range";
import { format } from "date-fns/format";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const BookingCalendar = () => {
  // date state
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const [daysSelected, setDaysSelected] = useState(false);

  const handleDaysSelect = (item) => {
    setRange([item.selection]);
    if (item.selection.startDate && item.selection.endDate) {
      setDaysSelected(true);
    } else {
      setDaysSelected(false);
    }
  };

  const handleReserveClick = () => {
    console.log("Reserved!");
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
      />
      <div>
        {daysSelected && (
          <button className="reserveButton" onClick={handleReserveClick}>
            Reserve
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCalendar;
