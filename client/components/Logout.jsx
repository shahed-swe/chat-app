import React from "react";
import { useRouter } from "next/router";
import { BiPowerOff } from "react-icons/bi";
import axios from "axios";
import { logoutRoute } from "../pages/api/config";

const Logout = () => {
  // Access the Next.js router
  const router = useRouter();

  // Function to handle the logout action
  const handleClick = async () => {
    // Get the user ID from localStorage
    const id = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))._id;
    // Send a request to the server to log out the user using the logoutRoute
    const res = await axios.get(`${logoutRoute}/${id}`);
    console.log(res);
    // If the logout is successful (status code 200), clear the localStorage and redirect to the login page
    if (res.status === 200) {
      localStorage.clear();
      router.push("/login");
    }
  };

  // Render the logout button
  return (
    <button
      className="flex justify-center items-center p-2 rounded bg-indigo-700 cursor-pointer"
      onClick={handleClick}
    >
      {/* Render the power off icon */}
      <BiPowerOff className="text-white text-lg" />
    </button>
  );
};

export default Logout;
