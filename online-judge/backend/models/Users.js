import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    problem_name: {
        type: String,
        required: true,
    },
    verdict: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    code: {
        type: String,
        required: true,
    },
});

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
    },
    role: {
        type: String,
        default: 'user',
        enum: ["admin", 'user'],
    },
    solved_problems: {
        type: [submissionSchema],
        default: [],
    }
});

const User = mongoose.model('user', userSchema);
export default User;
