import express from 'express';
import Problem from '../models/Problems.js';
import cookieJwtAuth from '../middleware/cookieJwtAuth.js';

const router = express.Router();

// Fetch all problems
router.get('/', cookieJwtAuth, async (req, res) => {
  try {
    const problems = await Problem.find({});
    res.json(problems);
  } catch (error) {
    console.log("Not able to fetch Problem data : " + error);
    res.status(500).json({ message: "Error fetching problems" });
  }
});

// Fetch problem by ID
router.get('/get_problem/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const problem = await Problem.findById({ _id: id });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json(problem);
  } catch (error) {
    console.log("Not able to fetch problem data : " + error);
    res.status(500).json({ message: "Error fetching problem" });
  }
});

// Create Problem
router.post('/create_problem', async (req, res) => {
  try {
    const { problem_title, problem_statement, sample_input, sample_output, test_cases } = req.body;

    if (!(problem_title && problem_statement)) {
      return res.status(400).send("Please enter all the fields");
    }

    const problem = await Problem.create({ problem_title, problem_statement, sample_input, sample_output, test_cases });

    res.status(201).json({
      message: "Successfully created",
      success: true,
      problem,
    });
  } catch (error) {
    console.log("Error reaching create : " + error);
    res.status(500).json({ message: "Error creating problem" });
  }
});

// Update Problem
router.put('/update_problem/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const updatedProblem = await Problem.findByIdAndUpdate(
      { _id: id },
      {
        problem_title: req.body.problem_title,
        problem_statement: req.body.problem_statement,
        sample_input: req.body.sample_input,
        sample_output: req.body.sample_output,
        test_cases: req.body.test_cases
      },
      { new: true } // This option returns the updated document
    );

    if (!updatedProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json(updatedProblem);
  } catch (error) {
    console.log("Error updating problem: " + error);
    res.status(500).json({ message: "Error updating problem" });
  }
});

// Delete Problem
router.delete('/delete_problem/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const problem = await Problem.findByIdAndDelete({ _id: id });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(200).json({ message: "Problem successfully deleted" });
  } catch (error) {
    console.log("Error deleting problem : " + error);
    res.status(500).json({ message: "Error deleting problem" });
  }
});

export default router;
