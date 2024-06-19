import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const DBConnection = async () => {
    const MONGODB_URL = process.env.MONGODB_URI;
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("DB Connection established");
    } catch (error) {
        console.log("error connecting to mongodb : " + error);
    }
};

export default DBConnection;