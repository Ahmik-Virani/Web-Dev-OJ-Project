import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
    input: {
        type: String,
    },
    output: {
        type: String,
    }
});

const tagSchema = new mongoose.Schema({
    tag: {
        type: String,
    }
})

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
    },
    difficulty: {
        type: String,
    },
    selected_tags: {
        type: [tagSchema],
        default: [],
    }
});

const Problem = mongoose.model("problem", problemSchema);
export default Problem;
