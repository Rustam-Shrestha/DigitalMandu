const User = require("../../../models/userModel");
const hx = require('bcryptjs')


//get my profile controller
exports.getMyProfile = async (rq, rs) => {
    const userID = rq.user.id;
    const myProfile = await User.findById({ userId: userID })
    if (!myProfile) {
        return rs.status(404).json({ message: "User not found" })
    }
    return rs.json({
        messageg: "found the data",
        data: myProfile
    })


}



//update my profile controller

exports.updateProfile = async (req, res) => {
    const { userName, userEmail, userPhone } = req.body
    const userID = req.user.id;
    //updating user data by finding the data from id and setting new data
    const updatedUser = await User.findByIdAndUpdate({ userId: userID }, {
        $set: {
            name: userName,
            email: userEmail,
            phone: userPhone
        }
        // run validators does is rerun the userModel.js on the given data
    }, { new: true, runValidators: true })
    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" })
    }
    return res.json({ message: "Profile updated successfully", data: updatedUser })
}

// Updating the password of user
exports.updatePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userID = req.user.id;

    // Check if all fields are filled
    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    // Find the user by ID
    const user = await User.findById(userID);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Check if old password matches
    const isPasswordMatch = await hx.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
        return res.status(401).json({ message: "Old password is incorrect" });
    }

    // Check if new password and confirm password match
    if (newPassword.trim() !== confirmPassword.trim()) {
        return res.status(400).json({ message: "Confirmed password and new password do not match" });
    }

    // Hash the new password
    const hashedPassword = await hx.hash(newPassword, 12);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Expire the token (assuming you have a function to handle this)
    expireToken(req, res);

    return res.json({ message: "Password updated successfully", data: user });
};

// Function to expire the token
const expireToken = (req, res) => {
    // Logic to expire the token
    // This could involve setting a token expiration time or removing the token from the database
    // orsimplyu blacklist the token 
    req.user.token = null;
    res.status(200).json({ message: "Token expired" });
};


//delete my profile contorller
exports.deleteProfile = async (req, res) => {
    const userID = req.user.id;
    const deletedUser = await User.findByIdAndDelete({ userId: userID })
    if (!deletedUser) {
        return res.status(404).json({ message: "User not found" })
    }
    return res.json({ message: "Profile deleted successfully" })
}


