// Importing the Mongoose library to work with MongoDB
const mongoose = require("mongoose");

// Creating a Mongoose Schema to define the structure of the 'users' collection
const userModel = new mongoose.Schema({
    // Defining a field 'username' of type String, which is required and should be between 3 to 20 characters long
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true, // Ensures that each username is unique
    },

    // Defining a field 'email' of type String, which is required, and its maximum length should be 50 characters
    email: {
        type: String,
        required: true,
        unique: true, // Ensures that each email is unique
        max: 50,
    },

    // Defining a field 'password' of type String, which is required, and its minimum length should be 8 characters
    password: {
        type: String,
        required: true,
        min: 8,
    },

    // Defining a field 'isAvatarImageSet' of type Boolean, which is optional. Default value is set to 'false'
    isAvatarImageSet: {
        type: Boolean,
        default: false,
    },

    // Defining a field 'avatarImage' of type String, which is optional. Default value is set to an empty string
    avatarImage: {
        type: String,
        default: "",
    },
});

// Creating a Mongoose model named "Users" based on the defined schema
module.exports = mongoose.model("Users", userModel);
