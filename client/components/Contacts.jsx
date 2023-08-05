import React, { useState, useEffect } from "react";
import Logout from "./Logout";

const Contacts = ({ contacts, changeChat }) => {
  // State to store the current user's name and image from localStorage
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  // State to keep track of the currently selected contact
  const [currentSelected, setCurrentSelected] = useState(undefined);

  // useEffect to fetch and set the current user's name and image from localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
    setCurrentUserName(data?.username);
    setCurrentUserImage(data?.avatarImage);
  }, []);

  // Function to change the current chat when a contact is selected
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  // Render the Contacts component
  return (
    <>
      {/* Render the contacts section only if currentUserImage exists */}
      {currentUserImage && currentUserImage && (
        <div className="grid grid-rows-10% 75% 15% overflow-hidden bg-blue-800">
          {/* Top section with the chat app name */}
          <div className="flex justify-center items-center space-x-2 text-white">
            <div className="flex items-center gap-1">
              <h3 className="text-white uppercase">Chat App</h3>
            </div>
          </div>
          {/* Middle section displaying the list of contacts */}
          <div className="flex flex-col items-center overflow-auto gap-2 p-2">
            {/* Loop through contacts and display each contact */}
            {contacts.map((contact, index) => (
              <div
                key={contact._id}
                // Apply dynamic styling to the contact based on whether it's currently selected or not
                className={`flex items-center gap-1 p-1 rounded ${index === currentSelected ? 'bg-indigo-300' : 'bg-indigo-700'
                  } cursor-pointer w-5/6 md:w-90%`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                {/* Display the contact's avatar */}
                <div className="w-12 h-12">
                  <img
                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                {/* Display the contact's username */}
                <h3 className="text-white">{contact.username}</h3>
              </div>
            ))}
          </div>
          {/* Bottom section showing the current user's name, avatar, and Logout button */}
          <div className="flex justify-center items-center gap-2 bg-blue-900 p-2">
            {/* Display the current user's avatar */}
            <div className="w-12 h-12">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            {/* Display the current user's name */}
            <h2 className="text-white">{currentUserName}</h2>
            {/* Render the Logout component */}
            <Logout />
          </div>
        </div>
      )}
    </>
  );
};

export default Contacts;
