import mongoose from 'mongoose'

const problemSchema = new mongoose.Schema({
    problem_title: {
        type: String,
        required: true,
        unique: true,
    },
    problem_statement: {
        type: String,
        required: true,
    },
    sample_input: {
        type: String,
    },
    sample_output: {
        type: String
    },
});

const Problem = mongoose.model("problem", problemSchema);
export default Problem;
