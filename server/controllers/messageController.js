// Importing the "Messages" model defined in "../models/message"
const Messages = require("../models/messages");

// Get messages between two users endpoint
module.exports.getMessages = async (req, res, next) => {
    try {
        const { from, to } = req.body;

        // Fetch messages from the database where the 'users' field contains both 'from' and 'to' user IDs
        // Sorting the messages by their 'updatedAt' field in ascending order (oldest to newest)
        const messages = await Messages.find({
            users: {
                $all: [from, to],
            },
        }).sort({ updatedAt: 1 });

        // Map the fetched messages to a new format for the response, indicating if the message was sent from the requesting user
        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            };
        });

        // Send the formatted messages in the response
        res.json(projectedMessages);
    } catch (ex) {
        next(ex);
    }
};

// Add a new message endpoint
module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;

        // Create a new message document in the database
        const data = await Messages.create({
            message: { text: message },
            users: [from, to], // Store the 'from' and 'to' user IDs in the 'users' array
            sender: from, // Store the 'from' user ID as the 'sender'
        });

        // Check if the message was successfully added to the database and send the appropriate response
        if (data) return res.json({ msg: "Message added successfully." });
        else return res.json({ msg: "Failed to add message to the database" });
    } catch (ex) {
        next(ex);
    }
};
