import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../pages/api/config";

const ChatContainer = ({ currentChat, socket }) => {
    // State to manage messages in the chat
    const [messages, setMessages] = useState([]);
    // Ref to the last message element to scroll to the bottom when new messages arrive
    const scrollRef = useRef();
    // State to hold the latest arrival message (message received from the server)
    const [arrivalMessage, setArrivalMessage] = useState(null);

    // Effect to fetch chat history between the current user and the selected chat partner
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
        const fetchData = async () => {
            const response = await axios.post(recieveMessageRoute, {
                from: data._id,
                to: currentChat._id,
            });
            setMessages(response.data);
        };
        fetchData();
    }, [currentChat]);

    // Effect to get the current user's ID (not sure why it's not directly used)
    useEffect(() => {
        const getCurrentChat = async () => {
            if (currentChat) {
                return JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))._id;
            }
        };
        getCurrentChat();
    }, [currentChat]);

    // Function to handle sending messages
    const handleSendMsg = async (msg) => {
        const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
        // Emit 'send-msg' event through the socket with message data
        socket.current.emit('send-msg', {
            to: currentChat._id,
            from: data._id,
            msg,
        });
        // Send the message to the server via axios
        await axios.post(sendMessageRoute, {
            from: data._id,
            to: currentChat._id,
            message: msg,
        });

        // Update the state with the new message to display it instantly
        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs);
    };

    // Effect to listen for 'msg-recieve' events from the socket
    useEffect(() => {
        if (socket.current) {
            socket.current.on('msg-recieve', (msg) => {
                // Set the arrivalMessage state with the new received message
                setArrivalMessage({ fromSelf: false, message: msg });
            });
        }
    }, []);

    // Effect to add the newly arrived message to the messages state when it's received
    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    // Effect to scroll to the bottom of the chat when new messages arrive
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Render the chat container with user interface components
    return (
        <div className="grid grid-rows-10% 80% 10% gap-0.1rem overflow-hidden">
            {/* Top section with user's avatar, username, and logout button */}
            <div className="flex justify-between items-center p-2">
                <div className="flex items-center gap-1">
                    <div className="avatar">
                        <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="" />
                    </div>
                    <div className="username">
                        <h3 className="text-white">{currentChat.username}</h3>
                    </div>
                </div>
                <Logout />
            </div>
            {/* Middle section displaying the chat messages */}
            <div className="p-2 flex flex-col gap-1 overflow-auto">
                {messages.map((message) => (
                    <div key={uuidv4()} ref={scrollRef}>
                        <div
                            className={`${message.fromSelf ? 'flex justify-end' : 'flex justify-start'
                                }`}
                        >
                            <div className="content max-w-40% md:max-w-70% overflow-wrap-break-word p-4 text-white rounded">
                                <p>{message.message}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Bottom section with the input field for typing and sending messages */}
            <ChatInput handleSendMsg={handleSendMsg} />
        </div>
    );
};

export default ChatContainer;
