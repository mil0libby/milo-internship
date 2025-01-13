import React, { useEffect, useState } from "react";

export default function Countdown({ timeLeft }) {
  const [timePassed, setTimePassed] = useState(0);
  function getDate(expiryDate) {
    let dateString = "";
    const remainingTime = expiryDate - Date.now();
    const seconds = Math.max(Math.floor(remainingTime / 1000), 0); // Ensure it doesn't go negative
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimePassed((prev) => prev + 1);
    }, 1000);
  }, []);

  return <div className="de_countdown">{getDate(timeLeft - timePassed)}</div>;
}
