const express = require("express");
const { connectDatabase } = require("./database/database");
const app = express();

// Import the User model
const User = require("./models/userModel");

// we are actually supposed to import bcrypt to use it for hashing passwords
const hx = require('bcryptjs')

//require jsonwebtoken for using it to login the user
const webtoken = require('jsonwebtoken');

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

app.post("/login", async (req, res) => {
    // destructuring the user given email and password
    const { userEmail, userPassword } = req.body;

    // knocking out the user with no fillyp before loading to the server
    if (!userEmail || !userPassword) {
        // throw message of enter the details to login
        return res.status(400).json({
            message: "Please enter your email and password to login"
        });
    }

    try {
        // finding the user with the given email
        // its callback takes two parameters error while finding 
        // number of users found with its detail
        const user = await User.findOne({ email: userEmail });

        // in case of no user found report it out
        if (!user) {
            res.status(404).json({ message: "User not found" });
        } else {
            // hashing the password given by user
            const hashedPassword = user.password;
            // comparing the hashed password with the password given by user
            const isValidPassword = hx.compareSync(userPassword, hashedPassword);
            if (isValidPassword) {
                // console.log(user._id.toString())
                // console.log(process.env.SECRET_KEY+"is secret");
                const token = webtoken.sign(
                    { id: user._id.toString() },
                    process.env.SECRET_KEY,
                    { expiresIn: '1h', algorithm: 'HS256' } // HS256 is default, but specifying it is safer
                );
                console.log("after sign")
                res.status(200).json({ 
                    message: "Login successful",
                    token: token 
                });
            } else {
                res.status(401).json({ message: "Invalid password" });
            }
        }
    } catch (err) {
        // in case of error report it without crash
        res.status(500).json({ message: "Error in database" });
    }
});
// Register route
app.post("/register", async (req, res) => {
    // Destructure the JSON form data
    const { userEmail, userName, userPhone, userPassword } = req.body;

    // Check for empty fields
    if (!userEmail || !userPhone || !userName || !userPassword) {
        // Bad request
        return res.status(400).json({
            message: "User creation failed"
        });
    } else {
        try {
            // Check if a user with the same email already exists
            // select * from table limit 1 type code in mongodb
            const existingUser = await User.findOne({ email: userEmail });
            if (existingUser) {
                return res.status(400).json({
                    message: "User with given email already exists"
                });
            }

            // Create a new user
            await User.create({
                email: userEmail,
                name: userName,
                phone: userPhone,
                // Hash the password before saving
                // givingthe plain password to the hash funciton to have hashed value  of the plain text
                // hask sync function takes the plain password and salt as cost of hashing 
                // computer with high GPU can only handle high salt values so be choosy here so 10-12 is ideal
                password: hx.hashSync(userPassword, 10)
            });

            // Send success message
            res.status(201).json({
                message: "User created successfully"
            });
        } catch (error) {
            // Handle errors
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