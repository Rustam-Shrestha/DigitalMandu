const { createProduct } = require('../controller/admin/product/productController');
const isUserAuthenticated = require('../middlewares/isAuthenticated');
const restrict = require('../middlewares/restrict');

//using express router
const rtr = require('express').Router();


//authenticatio routes 
// htting post request on the /register endpoint with the logics
// rtr.route('/add_product').post(createProduct)
// thisis post request wit htwo diffwentr contorller
// we fust go from is user authenticated to the create product 
// for tat the control must pass from isuserauthenticated
// then they wil be able to create product
// the next() takes us from isuserauthenticated controller to create produce controller
// see next() in action in middleware folder inside the file for isauthenticated.js
rtr.route('/add_product').post(isUserAuthenticated, restrict("admin"),createProduct)



module.exports = rtr;
