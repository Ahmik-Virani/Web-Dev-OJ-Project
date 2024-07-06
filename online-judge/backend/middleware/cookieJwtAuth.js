// middleware/cookieJwtAuth.js

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/Users.js'

dotenv.config();

export const cookieJwtAuth = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: "No token found" });
    }

    jwt.verify(token, process.env.SECRET_KEY, async (err, existingUser) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ message: "Invalid token" });
        }
        const _existingUser = (existingUser = await User.findById(existingUser.id));
        if(!_existingUser){
            return res.status(401)
        }
        req.user = _existingUser;
        next();
    });
};
