import React, { useEffect, useState } from "react";
import { format, differenceInDays } from "date-fns";
import useEscapeKeyPress from "./useEscapeKeyPress";

const BookingSummary = ({ onClose, numberOfGuests, onBack }) => {
  const [contactData, setContactData] = useState({
    title: "",
    firstname: "",
    lastname: "",
    address1: "",
    address2: "",
    cityTown: "",
    postcode: "",
    county: "",
    email: "",
    mobile: "",
  });

  const [guestData, setGuestData] = useState([]);

  useEffect(() => {
    setGuestData(
      new Array(numberOfGuests).fill({ firstname: "", lastname: "" })
    );
  }, [numberOfGuests]);

  useEscapeKeyPress(onClose);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactData({ ...contactData, [name]: value });
  };

  const handleTitleChange = (e) => {
    setContactData({ ...contactData, title: e.target.value });
  };

  const handleGuestInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedGuestData = [...guestData];
    updatedGuestData[index][name] = value;
    setGuestData(updatedGuestData);
  };

  const inputFields = [
    {
      name: "title",
      type: "select",
      options: ["Mr", "Mrs", "Miss", "Ms", "Dr", "other"],
      placeholder: "Title*",
    },
    { name: "firstname", type: "text", placeholder: "First Name*" },
    { name: "lastname", type: "text", placeholder: "Last Name*" },
    { name: "address1", type: "text", placeholder: "Address 1*" },
    { name: "address2", type: "text", placeholder: "Address 2" },
    { name: "cityTown", type: "text", placeholder: "City/Town*" },
    { name: "postcode", type: "text", placeholder: "Postcode*" },
    { name: "county", type: "text", placeholder: "County" },
    { name: "email", type: "email", placeholder: "Email Address*" },
    { name: "mobile", type: "tel", placeholder: "Mobile Number*" },
  ];

  return (
    <div>
      <div className="popUpOverlay" onClick={onClose}></div>
      <div className="summaryPopUp">
        <div className="header">
          <span className="backButton" onClick={onBack}>
            ↩
          </span>
          <h3>Your Booking</h3>
          <span className="closeButton" onClick={onClose}>
            X
          </span>
        </div>

        <h5 className="contactDetails">Contact details</h5>

        <div className="contactForm">
          {inputFields.map((field, index) => (
            <React.Fragment key={index}>
              {field.type === "select" ? (
                <select
                  className="contactBoxes"
                  name={field.name}
                  value={contactData[field.name]}
                  onChange={
                    field.name === "title"
                      ? handleTitleChange
                      : handleInputChange
                  }
                >
                  {field.options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="contactBoxes"
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={contactData[field.name]}
                  onChange={handleInputChange}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {guestData.map((guest, index) => (
          <div key={index}>
            <h5 className="guestDetails">Guest {index + 1}</h5>
            <div className="guestForm">
              <input
                className="guestBoxes"
                type="text"
                name={`first${index}`}
                placeholder="First Name*"
                value={guest.firstname}
                onChange={(e) => handleGuestInputChange(e, index)}
              />
              <input
                className="guestBoxes"
                type="text"
                name={`lastname${index}`}
                placeholder="Last Name*"
                value={guest.lastname}
                onChange={(e) => handleGuestInputChange(e, index)}
              />
            </div>
          </div>
        ))}
        <div className="toPaymentButton">Continue to payment</div>
      </div>
    </div>
  );
};

export default BookingSummary;
