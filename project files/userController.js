const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ token: jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' }) });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, username, password } = req.body;

    try {
        // Find user by either email or username
        const user = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.is_admin ? 'admin' : 'user' },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, userId: user._id, role: user.is_admin ? 'admin' : 'user' });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// Update a user's profile data
exports.updateUserProfile = async (req, res) => {
    try {
        // Ensure that the user is authenticated and retrieve the user's ID from the token
        const userId = req.user.id; // The user ID is populated from the JWT token

        // Find the user in the database by their ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Destructure the data we want to update from the request body
        const { username, email, location, password } = req.body;

        // Validate if the fields are provided
        if (!username && !email && !location && !password) {
            return res.status(400).json({ error: "No data provided to update" });
        }

        // Prepare the update data
        const updatedData = {};

        if (username) {
            updatedData.username = username;
        }
        if (email) {
            updatedData.email = email;
        }
        if (location) {
            updatedData.location = location;
        }
        if (password) {
            // If password is provided, hash it before saving
            const salt = await bcrypt.genSalt(10);
            updatedData.password = await bcrypt.hash(password, salt);
        }

        // Update the user in the database with the new data
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        // Return the updated user data
        res.status(200).json({
            message: "User profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// userController.js

exports.logout = async (req, res) => {
    try {
        // The token is client-side, and we can't invalidate it server-side.
        // But, we can send a response instructing the client to delete the token.
        
        res.status(200).json({
            message: "User logged out successfully. Please delete the token from your client."
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error while logging out' });
    }
};
