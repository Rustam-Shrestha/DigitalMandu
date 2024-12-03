// create mongodb schema that takes userid username usernumber useremail and userpassword each not letting null values enter inside
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    userName: { type: String, required: [true, "name is required"] },
    userPhone: { type: String, required: [true, "number is required"] },
    userPassword: { type: String, required: [true, "password is required"] },
    userEmail: { type: String, required: [true, "email is required"] },
    role: { type: String, enum: ['customer', 'admin'], required: [true, "role is required"], default: "customer" },
});
// create model named User which is in side param assigns it the model we created above
// and assigns it to User variable
const User = mongoose.model('User', userSchema);
// making the model availabe for other users 
module.exports = User;