const { registerUser, loginUser } = require('../controller/auth/authController');

//using express router
const rtr = require('express').Router();


//authenticatio routes 
// htting post request on the /register endpoint with the logics
rtr.route('/register').post(registerUser)
rtr.route('/login').post(loginUser)


module.exports = rtr;
