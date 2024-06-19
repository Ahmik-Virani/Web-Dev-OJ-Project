import User from '../models/Users.js';
import bcrypt from 'bcryptjs';

export const uploadImage = async (req, res) => {
    try {
        // Ensure req.user is populated
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: User information is missing' });
        }

        // Log the request object for debugging (remove in production)
        console.log(req);

        // Create the user object
        const userObj = {
            firstname: req.user.firstname,
            lastname: req.user.lastname,
            email: req.user.email,
            password: req.user.password,
        };

        // Encrypt the password before saving
        userObj.password = await bcrypt.hash(userObj.password, 10);

        // Save the user to the database
        const user = await User.create(userObj);

        // Send a success response
        res.status(201).json({
            message: 'User created successfully',
            user: {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                // Do not send the password back in the response
            }
        });
    } catch (error) {
        console.error("Upload failed with error:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
