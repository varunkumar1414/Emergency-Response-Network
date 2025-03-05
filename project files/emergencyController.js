const Emergency = require('../models/emergencyModel');

exports.createEmergency = async (req, res) => {
    try {
        const emergency = await Emergency.create(req.body);
        res.status(201).json(emergency);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEmergencies = async (req, res) => {
    const emergencies = await Emergency.find().populate('assignedTo');
    res.json(emergencies);
};

exports.updateEmergency = async (req, res) => {
    const { emergencyId } = req.params; // Get the emergencyId from the URL
    const { description, location, emergency } = req.body; // Get the fields to update

    try {
        // Find the emergency by its ID and update it
        const updatedEmergency = await Emergency.findByIdAndUpdate(
            emergencyId,
            {
                description,
                location,
                emergency // Emergency type (e.g., RED, YELLOW, GREEN)
            },
            { new: true } // Return the updated document
        );

        if (!updatedEmergency) {
            return res.status(404).json({ message: 'Emergency not found' });
        }

        // Respond with the updated emergency
        res.status(200).json(updatedEmergency);
    } catch (error) {
        console.error('Error updating emergency:', error);
        res.status(500).json({ message: 'Server error while updating emergency' });
    }
};

exports.getNearbyEmergencies = async (req, res) => {
    const { location } = req.params;  // Get the location from the route parameter

    try {
        // Query the database to find emergencies near the provided location
        const emergencies = await Emergency.find({ location: location });

        // If no emergencies are found
        if (emergencies.length === 0) {
            return res.status(404).json({ message: 'No emergencies found near this location' });
        }

        // Return the emergencies found
        res.status(200).json(emergencies);
    } catch (error) {
        console.error('Error fetching emergencies:', error);
        res.status(500).json({ message: 'Server error while fetching emergencies' });
    }
};

exports.filterEmergencies = async (req, res) => {
    try {
        // Extract query parameters from the request
        const query = req.query;

        // Build the filter object dynamically
        let filterConditions = {};

        // Check for specific filters and add them to the filter conditions
        if (query.severity) {
            filterConditions.severity = query.severity;
        }
        if (query.status) {
            filterConditions.status = query.status;
        }
        if (query.location) {
            filterConditions.location = { $regex: query.location, $options: 'i' };  // Case-insensitive search
        }

        // Fetch filtered emergencies from the database
        const emergencies = await Emergency.find(filterConditions);

        // If no emergencies are found
        if (emergencies.length === 0) {
            return res.status(404).json({ message: 'No emergencies found matching the filter' });
        }

        // Return the filtered emergencies
        res.status(200).json(emergencies);
    } catch (error) {
        console.error('Error fetching filtered emergencies:', error);
        res.status(500).json({ message: 'Server error while filtering emergencies' });
    }
};