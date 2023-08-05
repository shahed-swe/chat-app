import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";

const ChatInput = ({ handleSendMsg }) => {
  // State to store the message being typed in the input field
  const [msg, setMsg] = useState("");
  // State to control whether the emoji picker is visible or not
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Function to show or hide the emoji picker when the smiley icon is clicked
  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Function to handle emoji selection from the emoji picker
  const handleEmojiClick = (event) => {
    let message = msg;
    // Concatenate the selected emoji to the message
    message += event.emoji;
    setMsg(message);
  };

  // Function to handle sending the chat message
  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      // Call the parent component's handleSendMsg function to send the message
      handleSendMsg(msg);
      // Clear the input field after sending the message
      setMsg("");
    }
  };

  // Render the chat input section
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center bg-blue-800 px-4 md:px-8 py-2">
      {/* Emoji picker section */}
      <div className="flex justify-center md:justify-start items-center space-x-2 text-white">
        <div className="relative">
          {/* Smiley icon to toggle the emoji picker */}
          <BsEmojiSmileFill
            onClick={handleEmojiPickerHideShow}
            className="text-yellow-300 cursor-pointer text-2xl"
          />
          {/* Show the emoji picker if showEmojiPicker is true */}
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      {/* Chat input form */}
      <form
        className="flex items-center space-x-2 w-full md:w-auto"
        onSubmit={sendChat}
      >
        {/* Input field for typing the message */}
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          className="w-full h-10 bg-transparent text-white border rounded-md border-blue-900 px-4"
        />
        {/* Send button to submit the message */}
        <button
          type="submit"
          className="bg-purple-700 text-white rounded-md px-4 py-2 hover:bg-purple-800"
        >
          {/* Send icon */}
          <IoMdSend className="text-xl" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
