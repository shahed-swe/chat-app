import React from "react";
import { useRouter } from "next/router";
import { BiPowerOff } from "react-icons/bi";
import axios from "axios";
import { logoutRoute } from "../pages/api/config";

const Logout = () => {
  const router = useRouter();
  const handleClick = async () => {
    const id = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))._id;
    const res = await axios.get(`${logoutRoute}/${id}`);
    console.log(res)
    if (res.status === 200) {
      localStorage.clear();
      router.push("/login");
    }
  };

  return (
    <button
      className="flex justify-center items-center p-2 rounded bg-indigo-700 cursor-pointer"
      onClick={handleClick}
    >
      <BiPowerOff className="text-white text-lg" />
    </button>
  );
};

export default Logout;
