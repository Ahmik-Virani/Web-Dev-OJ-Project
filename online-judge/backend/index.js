import express from 'express'
const app = express();
import DBConnection from './database/db.js';
import User from './models/Users.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import router from './routes/routes.js';
import cors from 'cors';

dotenv.config();

//middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

DBConnection();

// Get sends things from backend
// Slash means home route
app.get('/', (req, res) => {
    res.send("Welcome to today's class");
});

app.use('/', router)

app.get('/home', (req, res) => {
    res.send("Welcome to home");
});

//Taking data from frontend means its a post request
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
  

app.listen(8000, () => {
    console.log("sever is listening on port 8000");
});