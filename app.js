const express = require("express");
const { connectDatabase } = require("./database/database");
const app = express();


// requiring the registeruser and login user from auth controller from controller file
const { registerUser, loginUser } = require("./controller/auth/authController");

// We need this to parse JSON format data and URL-encoded data   
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Include .env to access environment variables
require('dotenv').config();

// Make database connection
connectDatabase(process.env.Mongo_URI);


//importing the authRoute.js in this file to work with routes
const auth_routes = require("./routes/authRoute");

// using the routes we added for the auth routes
// the "/" denotes that there are no subfolders for the route 
// we can leave it "" only it will work
app.use("/",auth_routes)

// Test API
app.get("/", (req, res) => {
    res.status(404).json({
        message: "I am alive"
    });
});



const PORT = process.env.PORT;
// Check server
app.listen(PORT, () => {
    console.log("Server is running at: http://localhost:" + PORT);
});