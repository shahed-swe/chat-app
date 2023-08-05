import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';
import axios from 'axios';

import { allUsersRoute, host } from "../pages/api/config";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

const Chat = () => {
  const router = useRouter();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  // Fetch user data from local storage when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        // If the user is not logged in, redirect to the login page
        router.push("/login");
      } else {
        // If the user is logged in, set the current user state
        setCurrentUser(JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)));
      }
    };
    fetchUserData();
  }, [router]);

  // Initialize socket.io connection when the currentUser state is updated
  useEffect(() => {
    if (currentUser) {
      // Create a new socket.io connection and emit the user's ID to the server
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  // Fetch the user's contacts when the currentUser state is updated
  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        // Check if the user has set their avatar image
        if (currentUser.isAvatarImageSet) {
          // If the avatar image is set, fetch the user's contacts from the server
          const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data);
        } else {
          // If the avatar image is not set, redirect to the avatar setting page
          router.push("/avatar");
        }
      }
    };
    fetchContacts();
  }, [currentUser]);

  // Function to handle chat change when a contact is clicked
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-1 bg-gray-900">
      <div className="container bg-opacity-60 bg-black grid grid-cols-1 md:grid-cols-2">
        {/* Render the Contacts component */}
        <Contacts contacts={contacts} changeChat={handleChatChange} />
        {/* Render either the Welcome component or the ChatContainer component based on currentChat state */}
        {currentChat === undefined ? (
          <Welcome />
        ) : (
          <ChatContainer currentChat={currentChat} socket={socket} />
        )}
      </div>
    </div>
  );
};

export default Chat;
