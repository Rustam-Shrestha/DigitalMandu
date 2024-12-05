const { registerUser, loginUser, forgotPassword } = require('../controller/auth/authController');

//using express router
const rtr = require('express').Router();


//authenticatio routes 
// htting post request on the /register endpoint with the logics
rtr.route('/register').post(registerUser)
rtr.route('/login').post(loginUser)
rtr.route('/forgot').post(forgotPassword)


module.exports = rtr;
