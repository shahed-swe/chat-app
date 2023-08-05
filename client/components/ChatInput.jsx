import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";


const ChatInput = ({ handleSendMsg }) => {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event) => {
    console.log(event)
    let message = msg;
    message += event.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center bg-blue-800 px-4 md:px-8 py-2">
      <div className="flex justify-center md:justify-start items-center space-x-2 text-white">
        <div className="relative">
          <BsEmojiSmileFill
            onClick={handleEmojiPickerHideShow}
            className="text-yellow-300 cursor-pointer text-2xl"
          />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form
        className="flex items-center space-x-2 w-full md:w-auto"
        onSubmit={sendChat}
      >
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          className="w-full h-10 bg-transparent text-white border rounded-md border-blue-900 px-4"
        />
        <button
          type="submit"
          className="bg-purple-700 text-white rounded-md px-4 py-2 hover:bg-purple-800"
        >
          <IoMdSend className="text-xl" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;