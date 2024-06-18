const express = require('express');
const app = express();
const {DBConnection} = require('./database/db.js');
const User = require('./models/Users.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

DBConnection();

// Get sends things from backend
// Slash means home route
app.get('/', (req, res) => {
    res.send("Welcome to today's class");
});

app.get('/home', (req, res) => {
    res.send("Welcome to home");
});

//Taking data from frontend means its a post request
app.post('/register', async (req, res) => {
    //Always use try catch for error handling
    
    try {
        //Get all the data from body (request body from frontend)
        const {firstname, lastname, email, password} = req.body;        //Destructuring

        //Check if all the data is entered and should exist
        if(!(firstname && lastname && email && password)) {
            res.status(400).send("Please enter all the required details");
        }

        //Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).send("User already exists");
        }

        //encrypt the password
        const hashPassword = bcrypt.hashSync(password, 10);
        console.log(hashPassword);

        //Save the user to the database
        const user = await User.create ({
            firstname,
            lastname, 
            email,
            password: hashPassword,
        });

        //generate a JWT token for user and send it
        const token = jwt.sign({id: user._id, email}, process.env.SECRET_KEY, {
            expiresIn : "1h"
        });
        user.token = token;
        user.password = undefined;
        res.status(201).json({
            message: "You have successfully registered",
            success: true,
            user
        })


    } catch (error) {
        console.log(error);
    }
});

app.post('/login', async (req, res) => {
    try {
        //get all the user data
        const {email, password} = req.body;

        //check that all data should exist
        if(!(email && password)){
            res.status(400).send("Please enter all required fields!");
        }

        //find the user in the database
        const existingUser = await User.findOne({email});
        if(!existingUser) {
            return res.status(400).send("User does not exist!");
        }

        //match the password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if(!isMatch) {
            res.status(400).send("Incorrect Password");
        };

        //create token
        const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });
        existingUser.token = token;
        existingUser.password = undefined;

        //store cookies
        const options = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true, //only manipulate by server not by client/user
        };

        //send the token
        res.status(200).cookie("token", token, options).json({
            message: "You have successfully logged in!",
            success: true,
            token,
        });
    } catch (error) {
        console.log(error);
    }
});

app.listen(8000, () => {
    console.log("sever is listening on port 8000");
});