const { getIo } = require('../socket');
const User = require('../models/userModel');
const Emergency = require('../models/emergencyModel');

// Controller to get alerts based on the user's location
exports.getAlerts = async (req, res) => {
    try {
        // Fetch the user's details using the user ID from the JWT token
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userLocation = user.location; // Assuming user has a location field in the User schema

        // Fetch all emergencies with the same location as the user
        const emergencies = await Emergency.find({ location: userLocation, status: 'pending' });

        // Return the fetched emergencies as alerts
        res.status(200).json({ alerts: emergencies });
    } catch (error) {
        console.error("Error fetching alerts:", error);
        res.status(500).json({ message: "Server error while fetching alerts" });
    }
};
