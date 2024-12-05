// we are actually supposed to import bcrypt to use it for hashing passwords
const hx = require('bcryptjs')

//require jsonwebtoken for using it to login the user
const webtoken = require('jsonwebtoken');

// Import the User model
const User = require("../../models/userModel");
const sendEmail = require('../../services/sendEmail');




exports.registerUser = async (req, res) => {
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
}

exports.loginUser = async (req, res) => {
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
}



// forgot password feature implementation
exports.forgotPassword = async (req, res) => {
    const { userEmail } = req.body;
    if (!userEmail) {
        // returning 400 status message for requesting user to give email
        return res.status(400).json({
            message: "Please enter your email to reset password"
        });
    }

    // checking if user email given is available in database 
    const emailExists = await User.findOne({ email: userEmail });
    if (!emailExists) {
        // returning 404 status message for user not found
        return res.status(404).json({
            message: "User not found"
        });
    } else {
        // creating otp with 4 digits 
        const otpUser = Math.floor(1000 + Math.random() * 9000);
        // as we give user the OTP we save it to verify them by storing them in db
        emailExists.otp = otpUser;
        await emailExists.save()
        await sendEmail({
            userEmail: userEmail,
            emailSubject: "Password Reset OTP for Digital Mandu",
            emailMessage: `Your OTP for password reset is ${otpUser}`,
        });
        return res.json({
            message: "Successfully sent message"
        });
    }
};


// verify user Given and system sent OTP 
exports.verifyOTP = async (req, res) => {
    // taking email and otp from user input
    const { userEmail, otpUser } = req.body;

    // checking if otp and email is not null, if null send status code 400
    if (!userEmail || !otpUser) {
        return res.status(400).json({
            message: "Please enter your email and OTP to verify"
        });
    }

    // finding the user with the given email in the db
    const user = await User.findOne({ email: userEmail });

    if (!user) {
        // invalid message in case of unidentified email
        return res.status(400).json({
            message: "No account with that email"
        });
    } else if (user.otp !== otpUser) {
        // returning 400 status message for invalid OTP
        return res.status(400).json({
            message: "Invalid OTP"
        });
    } else {
        // OTP is correct
        return res.status(200).json({
            message: "OTP is correct!"
        });
    }
}

// resetting the pasword afterforgeting in this endpoint we hit then we changet 
// the current password with user given passwword by using the otp verification from 
//avobe
exports.resetPassword = async (req, res) => {
    try {
        // taking email and new password from user input
        const { userEmail, newUserPassword, confirmUserPassword } = req.body;

        // checking if userEmail, newUserPassword, and confirmUserPassword are not null
        if (!userEmail || !newUserPassword || !confirmUserPassword) {
            return res.status(400).json({
                message: "Enter details in the field"
            });
        }

        // finding the user with the given email in the db
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(400).json({
                message: "No account with that email"
            });
        }

        // checking if new password is confirmed
        if (confirmUserPassword !== newUserPassword) {
            return res.status(400).json({
                message: "Please confirm your password by entering the new password twice"
            });
        }

        // checking if new password is not equal to old password (use password comparison logic)
        const isSamePassword = hx.compareSync(newUserPassword, user.password); // Compare hashed password
        if (isSamePassword) {
            return res.status(400).json({
                message: "New password cannot be the same as old password"
            });
        }

        // updating the user password with the new password
        user.password = hx.hashSync(newUserPassword, 10);
        await user.save();

        // sending success response
        return res.status(200).json({
            message: "Password reset successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred. Please try again later."
        });
    }
};
