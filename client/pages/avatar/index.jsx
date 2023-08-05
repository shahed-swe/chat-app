import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../../public/assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setAvatarRoute } from "../api/config";
import { useRouter } from "next/router";

const SetAvatar = () => {
  const api = `https://api.multiavatar.com/4645646`;
  const router = useRouter();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  // Redirect to login page if user is not authenticated
  useEffect(() => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
      router.push("/login");
  }, []);

  // Function to set the selected avatar as the user's profile picture
  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(user)
        );
        router.push("/");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  // Function to fetch multiple random avatars from the API and convert them to base64
  const fetchAllAatars = useCallback(async () => {
    let data = [];

    try {
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
    } catch (error) {
      console.log(error);
    }

    setAvatars(data);
    setIsLoading(false);
  }, [api]);

  // Fetch avatars when the component mounts
  useEffect(() => {
    fetchAllAatars();
  }, [fetchAllAatars]);

  // Render the SetAvatar component
  return (
    <>
      {isLoading ? (
        // Render loading spinner if avatars are being fetched
        <div className="flex justify-center items-center flex-col bg-gray-800 min-h-screen">
          <img src={loader.src} alt="loader" className="max-w-full" />
        </div>
      ) : (
        // Render avatar selection options if avatars are fetched
        <div className="flex justify-center items-center flex-col gap-3 bg-gray-800 min-h-screen">
          <div className="text-white">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="flex gap-2">
            {avatars.map((avatar, index) => (
              <div
                // Apply border style to indicate the selected avatar
                className={`border-4 border-transparent rounded-full ${selectedAvatar === index ? "border-indigo-600" : ""
                  } cursor-pointer w-24 h-24`}
                key={avatar}
                onClick={() => setSelectedAvatar(index)}
              >
                {/* Display the avatar image */}
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            ))}
          </div>
          <button
            onClick={setProfilePicture}
            className="bg-indigo-600 text-white px-4 py-2 rounded font-bold uppercase"
          >
            Set as Profile Picture
          </button>
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default SetAvatar;
