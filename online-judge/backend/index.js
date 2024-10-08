import express from 'express';
import DBConnection from './database/db.js';
import User from './models/Users.js';
import Problem from './models/Problems.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import generateFile from './compiler_codes/generateFile.js';
import executeCpp from './compiler_codes/executeCpp.js';
import generateInputFile from './compiler_codes/generateInputFile.js';
import executeJava from './compiler_codes/executeJava.js'
import executeC from './compiler_codes/executeC.js'
import executePy from './compiler_codes/executePy.js'


const app = express();
dotenv.config();

// Middleware
app.use(cors({
  // origin: 'http://localhost:5173',
  origin: 'https://www.codecraftbyahmik.online',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

DBConnection();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log(token);

  if (!token) {
    return res.status(401).json({ message: 'Access token missing', redirect: true, url: 'http://localhost:5173/' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token', redirect: true, url: 'http://localhost:5173/' });
    }
    req.user = user;
    next();
  });
};

// Default Route
app.get('/', (req, res) => {
  res.send("Welcome to today's class");
});

// User Registration
app.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!(firstname && lastname && email && password)) {
      return res.status(400).send("Please enter all the required details");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashPassword,
    });

    const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    user.token = token;
    user.password = undefined;
    res.status(201).json({
      message: "You have successfully registered",
      success: true,
      user,
      token
    });

  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// User Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).send("Please enter all required fields!");
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).send("User does not exist!");
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).send("Incorrect Password");
    }

    const token = jwt.sign({ id: existingUser._id, role: existingUser.role }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    existingUser.token = token;
    // existingUser.password = undefined;
    await existingUser.save();

    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
      httpOnly: true, 
      secure: true, 
      sameSite: 'none', 
    };

    res.cookie("token", token, options).status(200).json({
      message: "You have successfully logged in!",
      success: true,
      existingUser: {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
        token
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/logout', async (req, res) => {
  res.clearCookie('token');
  res.status(200).json('Logout success')
})

app.get('/problem', async (req, res) => {

  try {
    const problems = await Problem.find({});
    res.json(problems);
  } catch (error) {
    console.log("Not able to fetch Problem data : " + error);
    res.status(500).json({ message: "Error fetching problems" });
  }
});

app.get('/get_problem/:id', async (req, res) => {
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
app.post('/create_problem', async (req, res) => {
  try {
    const { problem_title, problem_statement, sample_input, sample_output, test_cases, difficulty, selected_tags } = req.body;

    if (!(problem_title && problem_statement)) {
      return res.status(400).send("Please enter all the fields");
    }

    const problem = await Problem.create({ problem_title, problem_statement, sample_input, sample_output, test_cases, difficulty, selected_tags });

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
app.put('/update_problem/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const updatedProblem = await Problem.findByIdAndUpdate(
      { _id: id },
      {
        problem_title: req.body.problem_title,
        problem_statement: req.body.problem_statement,
        sample_input: req.body.sample_input,
        sample_output: req.body.sample_output,
        test_cases: req.body.test_cases,
        difficulty: req.body.difficulty,
        selected_tags: req.body.selected_tags,
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
app.delete('/delete_problem/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const problem = await Problem.findByIdAndDelete({ _id: id });
  } catch (error) {
    console.log("Not able to fetch problem data : " + error);
    res.status(500).json({ message: "Error fetching problem" });
  }
})

app.post('/run', async (req, res) => {
  const { language = 'cpp', code, input } = req.body;
  console.log(language);

  if (code === undefined) {
    return res.status(400).json({
      success: false,
      message: "Empty code body",
    });
  }

  try {
    const filePath = await generateFile(language, code);
    const inputPath = await generateInputFile(input);

    const executeWithTimeout = (executionPromise, timeout) => {
      return Promise.race([
        executionPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Time Limit Exceeded')), timeout)
        )
      ]);
    };

    let output = '';
    switch (language) {
      case 'cpp':
        output = await executeWithTimeout(executeCpp(filePath, inputPath), 2000);
        break;
      case 'java':
        output = await executeWithTimeout(executeJava(filePath, inputPath), 2000);
        break;
      case 'py':
        output = await executeWithTimeout(executePy(filePath, inputPath), 2000);
        break;
      case 'c':
        output = await executeWithTimeout(executeC(filePath, inputPath), 2000);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: `Unsupported language: ${language}`,
        });
    }

    res.send({ filePath, output, inputPath });
  } catch (error) {
    console.log(error);
    if (error.message === 'Time Limit Exceeded') {
      return res.status(200).json({
        success: true,
        output: 'Time Limit Exceeded',
      });
    }
    res.status(500).json({
      success: false,
      message: "Error: " + error.message,
    });
  }
});

app.post('/submit_solution', authenticateToken, async (req, res) => {
  try {
      const { problem_name, verdict, code } = req.body;
      const userId = req.user.id;

      const submission = {
          problem_name,
          verdict,
          code,
          date: new Date()
      };

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      user.solved_problems.push(submission);
      await user.save();

      res.status(201).json({
          message: "Solution submitted successfully",
          submission
      });
  } catch (error) {
      console.log("Error submitting solution: ", error);
      res.status(500).json({ message: "Error submitting solution" });
  }
});

app.get('/submissions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('solved_problems');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user.solved_problems);
  } catch (error) {
    console.log("Error fetching submissions: ", error);
    res.status(500).json({ message: "Error fetching submissions" });
  }
});

// Example implementation in your Express app
app.get('/submissions/:id', authenticateToken, async (req, res) => {
  const id = req.params.id;

  try {
    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Optionally check if the user has permission to view this submission

    res.json({
      _id: submission._id,
      problem_name: submission.problem_name,
      code: submission.code,
      // Add other necessary fields
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(8000, () => {
  console.log("Server is listening on port 8000");
});
