
const { createReview, getProductReview, deleteReview, addProductReview } = require('../controller/user/userController');
const isUserAuthenticated = require('../middlewares/isAuthenticated');
const catchAsync = require('../services/catchAsync');

//using express router
const rtr = require('express').Router();
//authenticatio routes 
// htting post request on the /register endpoint with the logics

// rtr.route('/reviews/:id')
//     .get(catchAsync(getProductReview))
//     .delete(isUserAuthenticated, catchAsync(deleteReview))
//     .post(isUserAuthenticated, catchAsync(createReview));
rtr.route('/reviews/:id')
    .get(catchAsync(getProductReview))
    .delete(isUserAuthenticated, catchAsync(deleteReview))
    .post(isUserAuthenticated, catchAsync(addProductReview));


module.exports = rtr;
