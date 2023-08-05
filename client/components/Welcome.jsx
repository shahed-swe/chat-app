import React, { useState, useEffect } from "react";
import Robot from "../public/assets/robot.gif";


const Welcome = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
    if (data) {
      setUserName(data.username);
    }
  }, []);

  return (
    <div className="flex justify-center items-center flex-col text-white">
      <img src={Robot.src} alt="" className="h-80" />
      <h1 className="text-4xl mt-6">
        Welcome, <span className="text-indigo-600">{userName}!</span>
      </h1>
      <h3 className="mt-4">Please select a chat to start messaging.</h3>
    </div>
  );
};

export default Welcome;






