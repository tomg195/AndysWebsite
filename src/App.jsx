import { useState } from "react";
import ImageSlider from "./ImageSlider";

function App() {
  const images = [
    "./images/IMG1.jpg",
    "./images/IMG2.jpg",
    "./images/IMG3.jpg",
    "./images/IMG4.jpg",
    "./images/IMG5.jpg",
    "./images/IMG6.jpg",
    "./images/IMG7.jpg",
    "./images/IMG8.jpg",
    "./images/IMG9.jpg",
    "./images/IMG10.jpg",
    "./images/IMG11.jpg",
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

      {/* <div style={containerStyles}><ImageSlider images={images} /></div> */}

      <div>
        {/* <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a> */}
      </div>
    </div>
  );
}

export default App;
