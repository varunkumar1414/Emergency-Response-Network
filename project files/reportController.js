const Report = require('../models/reportModel');

exports.createReport = async (req, res) => {
    try {
        // Destructure the required fields from the request body
        const { report, location, emergency } = req.body;

        // Validate if the required fields are provided
        if (!report || !location || !emergency) {
            return res.status(400).json({ error: "Report, location, and emergency level are required." });
        }

        // Create a new report instance
        const newReport = new Report({
            report,
            reportedBy: req.user.id,  // The user ID from the JWT token
            location,
            emergency
        });

        // Save the report to the database
        await newReport.save();

        // Return a success response with the created report
        res.status(201).json({ message: 'Report created successfully', report: newReport });
    } catch (error) {
        // Catch any errors and respond with a 500 error
        console.error('Error creating report:', error);
        res.status(500).json({ error: 'Error creating report', message: error.message });
    }
};


exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('reportedBy');
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Controller Method to Get Nearby Reports
exports.getNearbyReports = async (req, res) => {
    const { location } = req.params; // Capture the location from the URL parameter

    try {
        // Search reports with a case-insensitive match to the location parameter
        const reports = await Report.find({
            location: { $regex: location, $options: 'i' } // 'i' for case-insensitive search
        });

        if (reports.length === 0) {
            return res.status(404).json({ message: 'No reports found for this location.' });
        }

        // Return the filtered reports
        res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching nearby reports:", error);
        res.status(500).json({ error: "Server error while fetching reports" });
    }
};

// Controller Method to Filter Reports
exports.filterReports = async (req, res) => {
    const { emergency, location, reportedBy, startDate, endDate } = req.query;

    // Build the query object dynamically based on the presence of query parameters
    let filter = {};

    if (emergency) {
        filter.emergency = emergency;
    }
    if (location) {
        filter.location = { $regex: location, $options: 'i' }; // Case-insensitive search
    }
    if (reportedBy) {
        filter.reportedBy = reportedBy;
    }
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) {
            filter.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
            filter.createdAt.$lte = new Date(endDate);
        }
    }

    try {
        const reports = await Report.find(filter);
        if (reports.length === 0) {
            return res.status(404).json({ message: 'No reports found for the given filters.' });
        }
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error filtering reports:', error);
        res.status(500).json({ error: 'Server error while filtering reports' });
    }
};
