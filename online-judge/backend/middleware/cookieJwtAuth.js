// middleware/cookieJwtAuth.js

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const cookieJwtAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "No token found" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = decoded; // Save decoded token payload to req.user if needed
        next();
    });
};
