// adding express framework
const express = require("express");
// cors package required because of allowing different source
const cors = require("cors");
// database initialize
const mongoose = require("mongoose");
// initializing app which will be run
const app = express();
// initializing socket
const socket = require("socket.io");
// dotenv to allow .env files variables inside the project
require("dotenv").config();
// here the app is adding cors headers 
app.use(cors());
// here the app is adding express 
app.use(express.json());
// route for authenticate user
const authRoutes = require("./routes/auth");
// route for message
const messageRoutes = require("./routes/messages");


// creating database connection
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        // if project is connected with the database
        console.log("DB Connetion Successfull");
    })
    .catch((err) => {
        // if database can't connet with the database
        console.log(err.message);
    });


    // default url 
app.get('/', (req, res) => {
    res.send('Application running properly');
});

// Mounting the "authRoutes" and "messageRoutes" middleware for the specified routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Starting the Express server and setting up Socket.IO
const server = app.listen(process.env.PORT, process.env.HOST, () =>
    console.log(`Server started on ${process.env.PORT}`)
);

// Creating a new instance of Socket.IO and configuring it to allow cross-origin requests from "https://kitchat.vercel.app"
const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

// Creating a global Map to store the online users' socket IDs
global.onlineUsers = new Map();

// Handling Socket.IO connections
io.on("connection", (socket) => {
    // Store the current socket in the global context (accessible from all routes and event handlers)
    global.chatSocket = socket;

    // Event listener to add a user to the list of online users
    socket.on("add-user", (userId) => {
        // When a user connects, store their socket ID in the "onlineUsers" Map with their user ID as the key
        onlineUsers.set(userId, socket.id);
    });

    // Event listener to send a message to a specific user
    socket.on("send-msg", (data) => {
        // Retrieve the socket ID of the target user from the "onlineUsers" Map
        const sendUserSocket = onlineUsers.get(data.to);

        // If the target user is online and their socket ID is available, send the message to them
        if (sendUserSocket) {
            // The "socket.to()" method sends the message to a specific socket (target user) without broadcasting it to others
            socket.to(sendUserSocket).emit("msg-recieve", data.msg);
        }
    });
});