// Importing the Mongoose library to work with MongoDB
const mongoose = require("mongoose");

// Creating a Mongoose Schema to define the structure of the 'messages' collection
const messageModel = mongoose.Schema(
    {
        // Defining a field 'message' with a sub-field 'text' of type String, which is required
        message: {
            text: { type: String, required: true },
        },

        // Defining a field 'users' as an array, which can store multiple user-related information
        users: Array,

        // Defining a field 'sender' to store the reference to a user (User model) who sent this message
        sender: {
            type: mongoose.Schema.Types.ObjectId, // This field will store a MongoDB ObjectId
            ref: "User", // This references the "User" model, meaning it refers to a user document in the "users" collection
            required: true, // The 'sender' field is required and must reference a valid user document
        },
    },
    {
        timestamps: true, // This option automatically adds 'createdAt' and 'updatedAt' fields to the documents
    }
);

// Creating a Mongoose model named "Messages" based on the defined schema
module.exports = mongoose.model("Messages", messageModel);
