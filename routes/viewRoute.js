///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const express = require('express');

const viewController = require('../controllers/viewController');

const authController = require('./../controllers/authController');

///////////////////////////////////////////////////////////
// routes for view routes
const router = express.Router();

router
    .get('/login', authController.isLoggedin, viewController.loginPage);
router
    .get('/', authController.isLoggedin, viewController.loginPage);
router
    .get('/signup', authController.isLoggedin, viewController.signupPage);
router
    .get('/forgotpassword', authController.isLoggedin, viewController.forgotPasswordPage);
router
    .get('/resetpassword/:token', authController.isLoggedin, viewController.resetPasswordPage);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Exposing the router middleware
module.exports = router;
///////////////////////////////////////////////////////////