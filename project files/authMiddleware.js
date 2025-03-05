const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract the token from Authorization header

    if (!token) {
        //no token provided, user is not logged in.
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace 'SecretKey' with your actual secret
        req.user = decoded;  // Attach the decoded user info to the request object
        next();  // Pass to the next middleware or route handler
    } catch (error) {
        //If token verification fails, user is not logged in
        return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
    }
};

module.exports = { verifyToken };
