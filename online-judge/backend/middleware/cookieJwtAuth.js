import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const cookieJwtAuth = (req, res, next) => {
    // const token = req.cookies.token;
    // if(!token){
    //     return res.status(401).json("No token found");
    // } 

    // jwt.verify(token, process.env.SECRET_KEY, (err, existingUserId) => {
    //     if(err){
    //         return res.status(403).json("Invalid token");
    //     }
    //     req.existingUser = {
    //         id: existingUserId,
    //     }
    //     next();
    // })

    //grab token from cookie
    const token = req.cookies.token

    //if no token, stop
    if (!token) {
        return res.status(403).json("Please login")
    }

    try {
        //if token present, decode that token
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        console.log(decode);

        req.user = decode

        //query to DB for that user id

    } catch (error) {
        console.log("Error authenticating" + error);
        res.status(401).json("Invalid token");
    }

    return next();
};
