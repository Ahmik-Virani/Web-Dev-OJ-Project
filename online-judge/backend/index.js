import express from 'express';
import DBConnection from './database/db.js';
import User from './models/Users.js';
import Problem from './models/Problems.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './routes/routes.js';
import cors from 'cors';
import generateFile from './compiler_codes/generateFile.js';
import executeCpp from './compiler_codes/executeCpp.js';
import generateInputFile from './compiler_codes/generateInputFile.js';

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

DBConnection();

// Default Route
app.get('/', (req, res) => {
  res.send("Welcome to today's class");
});

app.use('/', router);

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

    const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    existingUser.token = token;
    existingUser.password = undefined;

    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
      message: "You have successfully logged in!",
      success: true,
      token,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

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
    const { problem_title, problem_statement, sample_input, sample_output } = req.body;

    if (!(problem_title && problem_statement)) {
      return res.status(400).send("Please enter all the fields");
    }

    const problem = await Problem.create({ problem_title, problem_statement, sample_input, sample_output });

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
    const problem = await Problem.findByIdAndUpdate({ _id: id }, { problem_title: req.body.problem_title, problem_statement: req.body.problem_statement, sample_input: req.body.sample_input, sample_output: req.body.sample_output });
  } catch (error) {
    console.log("Not able to fetch problem data : " + error);
    res.status(500).json({ message: "Error fetching problem" });
  }
})

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

  if (code === undefined) {
    return res.status(400).json({
      success: false,
      message: "Empty code body",
    });
  }

  try {
    const filePath = await generateFile(language, code);
    const inputPath = await generateInputFile(input);
    const output = await executeCpp(filePath, inputPath);
    res.send({ filePath, output, inputPath });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error" + error.message,
    })
  }

})

app.listen(8000, () => {
  console.log("Server is listening on port 8000");
});
