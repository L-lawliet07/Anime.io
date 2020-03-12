///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const express = require('express');

/*
 * userController to control user Routes
 */
const userController = require('../controllers/userController');

const authController = require('../controllers/authController');

///////////////////////////////////////////////////////////
// router for home routes
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword', authController.resetPassword);


router
    .get('/profile', authController.protect, userController.profilePage);

router
    .get('/setting', authController.protect, userController.settingPage)
    .patch('/setting', authController.protect, userController.updateMe);

router
    .get('/users', authController.protect, userController.getAllUser);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Exposing the router middleware
module.exports = router;
///////////////////////////////////////////////////////////