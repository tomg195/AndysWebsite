import { useState } from "react";
import ImageSlider from "./ImageSlider";
import BookingCalendar from "./BookingCalendar";

function App() {
  const images = [
    { url: "https://andyhardingholidayhome.netlify.app/images/IMG1.jpg" },
    { url: "/IMG2.jpg" },
    { url: "/IMG3.jpg" },
    { url: "/IMG4.jpg" },
    { url: "/IMG5.jpg" },
    { url: "/IMG6.jpg" },
    { url: "/IMG7.jpg" },
    { url: "/IMG8.jpg" },
    { url: "/IMG9.jpg" },
    { url: "/IMG10.jpg" },
    { url: "/IMG11.jpg" },
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
