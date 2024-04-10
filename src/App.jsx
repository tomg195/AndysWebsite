import { useState } from "react";
import ImageSlider from "./ImageSlider";
import BookingCalendar from "./BookingCalendar";

function App() {
  const images = [
    { url: "/images/IMG1.jpg" },
    { url: "/images/IMG2.jpg" },
    { url: "/images/IMG3.jpg" },
    { url: "/images/IMG4.jpg" },
    { url: "/images/IMG5.jpg" },
    { url: "/images/IMG6.jpg" },
    { url: "/images/IMG7.jpg" },
    { url: "/images/IMG8.jpg" },
    { url: "/images/IMG9.jpg" },
    { url: "/images/IMG10.jpg" },
    { url: "/images/IMG11.jpg" },
  ];

  const containerStyles = {
    width: "650px",
    height: "600px",
    margin: "0 auto",
  };

  return (
    <div>
      <div className="banner">
        <h1>Andy's holiday home</h1>
      </div>

      <div style={containerStyles}>
        <ImageSlider images={images} />
      </div>

      <h2>Pick your days:</h2>

      <div>
        <BookingCalendar />
      </div>
    </div>
  );
}

export default App;
