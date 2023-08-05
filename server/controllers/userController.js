// Importing the required modules and the 'User' model defined in '../models/user'
const User = require("../models/user");
const bcrypt = require("bcrypt");

// Login endpoint to authenticate the user with their username and password
module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        // Find the user by their username in the database
        const user = await User.findOne({ username });
        if (!user)
            return res.json({ msg: "Incorrect Username or Password", status: false });

        // Check if the provided password matches the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.json({ msg: "Incorrect Username or Password", status: false });

        // If the username and password are correct, delete the password from the user object and send the user data in the response
        delete user.password;
        return res.json({ status: true, user });
    } catch (ex) {
        next(ex);
    }
};

// Register endpoint to create a new user in the database
module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Check if the provided username or email is already used by an existing user
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck)
            return res.json({ msg: "Username already used", status: false });
        const emailCheck = await User.findOne({ email });
        if (emailCheck)
            return res.json({ msg: "Email already used", status: false });

        // Hash the password and create a new user in the database
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
        });

        // Delete the password from the user object and send the user data in the response
        delete user.password;
        return res.json({ status: true, user });
    } catch (ex) {
        next(ex);
    }
};

// Get all users endpoint, except the user with the provided id
module.exports.getAllUsers = async (req, res, next) => {
    try {
        // Fetch all users from the database, excluding the current user (specified by req.params.id)
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);

        // Send the list of users in the response
        return res.json(users);
    } catch (ex) {
        next(ex);
    }
};

// Set avatar image endpoint for a specific user
module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;

        // Update the user's 'isAvatarImageSet' and 'avatarImage' fields in the database
        const userData = await User.findByIdAndUpdate(
            userId,
            {
                isAvatarImageSet: true,
                avatarImage,
            },
            { new: true } // Return the updated user data
        );

        // Send the updated user's avatar image status in the response
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    } catch (ex) {
        next(ex);
    }
};

// Logout endpoint to remove a user from the list of online users
module.exports.logOut = (req, res, next) => {
    try {
        // Remove the user with the specified id from the list of online users
        if (!req.params.id) return res.json({ msg: "User id is required " });
        onlineUsers.delete(req.params.id);
        return res.status(200).send();
    } catch (ex) {
        next(ex);
    }
};
