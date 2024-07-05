import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    token: {
        type: String
    }
});

//Export through mongoose model
//Never keep plural, mongoose makes it plural automatically
const User = mongoose.model('user', userSchema);
export default User