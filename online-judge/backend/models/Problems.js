import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
    input: {
        type: String,
    },
    output: {
        type: String,
    }
});

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
    test_cases: {
        type: [testCaseSchema],
        default: [],
    }
});

const Problem = mongoose.model("problem", problemSchema);
export default Problem;
