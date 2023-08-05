import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../pages/api/config";

const ChatContainer = ({ currentChat, socket }) => {
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();
    const [arrivalMessage, setArrivalMessage] = useState(null);

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

    useEffect(() => {
        const getCurrentChat = async () => {
            if (currentChat) {
                return JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))._id;
            }
        };
        getCurrentChat();
    }, [currentChat]);

    const handleSendMsg = async (msg) => {
        const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
        socket.current.emit('send-msg', {
            to: currentChat._id,
            from: data._id,
            msg,
        });
        await axios.post(sendMessageRoute, {
            from: data._id,
            to: currentChat._id,
            message: msg,
        });

        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs);
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on('msg-recieve', (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg });
            });
        }
    }, []);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="grid grid-rows-10% 80% 10% gap-0.1rem overflow-hidden">
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
            <ChatInput handleSendMsg={handleSendMsg} />
        </div>
    );
};

export default ChatContainer;
