///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const express = require('express');

/*
    userController to control user Routes
*/
const userController = require('../controllers/userController');

const authController = require('../controllers/authController');

///////////////////////////////////////////////////////////
// router for home routes
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);


router
    .get('/profile', userController.profilePage);

router
    .get('/setting', userController.settingPage)
    .patch('/setting', userController.settingPage);

router
    .get('/users', userController.getAllUser);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Exposing the router middleware
module.exports = router;
///////////////////////////////////////////////////////////