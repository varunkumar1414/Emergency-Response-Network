require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');

const { initializeSocket } = require('./socket');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/user', require('./routes/userRoute'));
app.use('/report', require('./routes/reportRoute'));
app.use('/emergency', require('./routes/emergencyRoute'));
app.use('/alert', require('./routes/alertRoute'));

// Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI );
        console.log('MongoDB Connected Successfully');
        
        // Start server only after DB is connected
        const PORT = process.env.PORT || 5000;
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        // Initialize Socket.io after DB connection
        initializeSocket(server);

    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

// Call the function to connect to MongoDB
connectDB();
