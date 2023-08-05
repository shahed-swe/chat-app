import React, { useState, useEffect } from "react";
import Robot from "../public/assets/robot.gif";

const Welcome = () => {
  // State to store the username
  const [userName, setUserName] = useState("");

  // useEffect to fetch and set the username from localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
    if (data) {
      setUserName(data.username);
    }
  }, []);

  // Render the Welcome component
  return (
    <div className="flex justify-center items-center flex-col text-white">
      {/* Display the robot GIF */}
      <img src={Robot.src} alt="" className="h-80" />
      {/* Display the welcome message with the username */}
      <h1 className="text-4xl mt-6">
        Welcome, <span className="text-indigo-600">{userName}!</span>
      </h1>
      {/* Display a message asking the user to select a chat */}
      <h3 className="mt-4">Please select a chat to start messaging.</h3>
    </div>
  );
};

export default Welcome;
