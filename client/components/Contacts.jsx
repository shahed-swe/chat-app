import React, { useState, useEffect } from "react";
import Logout from "./Logout";

const Contacts = ({ contacts, changeChat }) => {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
    setCurrentUserName(data?.username);
    setCurrentUserImage(data?.avatarImage);
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && currentUserImage && (
        <div className="grid grid-rows-10% 75% 15% overflow-hidden bg-blue-800">
          <div className="flex justify-center items-center space-x-2 text-white">
            <div className="flex items-center gap-1">
              <h3 className="text-white uppercase">Chat App</h3>
            </div>
          </div>
          <div className="flex flex-col items-center overflow-auto gap-2 p-2">
            {contacts.map((contact, index) => (
              <div
                key={contact._id}
                className={`flex items-center gap-1 p-1 rounded ${index === currentSelected ? 'bg-indigo-300' : 'bg-indigo-700'
                  } cursor-pointer w-5/6 md:w-90%`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="w-12 h-12">
                  <img
                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="text-white">{contact.username}</h3>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center gap-2 bg-blue-900 p-2">
            <div className="w-12 h-12">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h2 className="text-white">{currentUserName}</h2>
            <Logout/>
          </div>
        </div>
      )}
    </>
  );
};

export default Contacts;
