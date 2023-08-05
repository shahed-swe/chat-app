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