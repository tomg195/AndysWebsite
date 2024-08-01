import React, { useEffect, useState } from "react";
import useEscapeKeyPress from "../../../useEscapeKeyPress";
import { useNavigate, useLocation } from "react-router-dom";
import "./BookingSummary.css";

const BookingSummary = ({ onClose, onBack }) => {
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
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedRange, people, pets, totalPrice, numberOfGuests } =
    location.state || {
      selectedRange: { startDate: null, endDate: null },
      people: 0,
      pets: 0,
      totalPrice: 0,
      numberOfGuests: 0,
    };

  useEffect(() => {
    if (numberOfGuests > 0) {
      setGuestData(
        Array.from({ length: numberOfGuests }, () => ({
          firstname: "",
          lastname: "",
        }))
      );
    }
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
    updatedGuestData[index] = { ...updatedGuestData[index], [name]: value };
    setGuestData(updatedGuestData);
  };

  const handleContinueToPayment = () => {
    const isContactDataValid = inputFields.every(
      (field) =>
        !field.placeholder.endsWith("*") ||
        contactData[field.name].trim() !== ""
    );

    const areGuestsValid = guestData.every(
      (guest) => guest.firstname.trim() !== "" && guest.lastname.trim() !== ""
    );

    if (isContactDataValid && areGuestsValid) {
      navigate("/checkout", {
        state: {
          selectedRange,
          people,
          pets,
          totalPrice,
        },
      });
    } else {
      setErrorMessage("Please fill out all areas of the form");
    }
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
                name="firstname"
                placeholder="First Name*"
                value={guest.firstname}
                onChange={(e) => handleGuestInputChange(e, index)}
              />
              <input
                className="guestBoxes"
                type="text"
                name="lastname"
                placeholder="Last Name*"
                value={guest.lastname}
                onChange={(e) => handleGuestInputChange(e, index)}
              />
            </div>
          </div>
        ))}

        {errorMessage && (
          <p style={{ color: "red", fontSize: "small", margin: "5px 0 0 0" }}>
            {errorMessage}
          </p>
        )}

        <button className="toPaymentButton" onClick={handleContinueToPayment}>
          Continue to payment
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;
