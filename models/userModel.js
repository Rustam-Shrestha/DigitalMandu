const mongoose = require('mongoose');

// Define the user schema with database fields as phone, name, and email
const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, "name is required"] },
    phone: { type: String, required: [true, "number is required"] },
    password: { type: String, required: [true, "password is required"] },
    email: { type: String, required: [true, "email is required"] },
    role: { type: String, enum: ['customer', 'admin'], required: [true, "role is required"], default: "customer" },
    otp: { type: Number},
    isOtpVerified: { type: Boolean, default:false},
});

// create model named User which is in side param assigns it the model we created above
// and assigns it to User variable
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;