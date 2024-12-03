const express = require("express");
const { connectDatabase } = require("./database/database");
const app = express(); 

// Import the User model
const User = require("./models/userModel");

// we are actually supposed to import bcrypt to use it for hashing passwords
const hx = require('bcryptjs')

// We need this to parse JSON format data and URL-encoded data   
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Include .env to access environment variables
require('dotenv').config();

// Make database connection
connectDatabase(process.env.Mongo_URI);

// Test API
app.get("/", (req, res) => {
    res.status(404).json({
        message: "I am alive"
    });
});

// Using POST request in /register endpoint 
app.post("/register", async (req, res) => {
    // destructuring the json form data
    const { userEmail, userName, userPhone, userPassword } = req.body;
    // checking the emptiness
    if (!userEmail || !userPhone || !userName || !userPassword) {
        // bad request
        return res.status(400).json({
            message: "User creation failed"
        });
    } else {
        // creatign user
        try {
            // Create a new user
            await User.create({
                // same as userEmail:userEmail
                userEmail,
                userName,
                userPhone,
                // givingthe plain password to the hash funciton to have hashed value  of the plain text
                // hask sync function takes the plain password and salt as cost of hashing 
                // computer with high GPU can only handle high salt values so be choosy here so 10-12 is ideal
                userPassword:hx.hashSync(userPassword,10)
            });
            // Send success message
            res.status(201).json({
                message: "User created successfully"
            });
        } catch (error) {
            // in case of error or server error give the friendly error message
            res.status(500).json({
                message: "Error creating user",
                error: error.message
            });
        }
    }
});

const PORT = process.env.PORT;
// Check server
app.listen(PORT, () => {
    console.log("Server is running at: http://localhost:" + PORT);
});