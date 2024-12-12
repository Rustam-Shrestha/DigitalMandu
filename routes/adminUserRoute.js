const { getUsers } = require("../controller/admin/users/userController");
const isUserAuthenticated = require("../middlewares/isAuthenticated");
const restrict = require("../middlewares/restrict");

const rtr = require("express").Router();
rtr.route("/users").get(isUserAuthenticated,restrict("admin"),getUsers)

module.exports = rtr