import { useEffect } from "react";

const useEscapeKeyPress = (onEscape) => {
  document.body.classList.add("popUp-open");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onEscape();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("popUp-open");
    };
  }, [onEscape]);
};

export default useEscapeKeyPress;
