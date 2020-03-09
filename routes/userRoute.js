///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const express = require('express');

/*
    userController to control user Routes
*/
const userController = require('../controllers/userController');


///////////////////////////////////////////////////////////
// router for home routes
const router = express.Router();

router
    .get('/profile', userController.profilePage);

router
    .get('/setting', userController.settingPage)
    .patch('/setting', userController.settingPage);

router
    .get('/users', userController.usersPage);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Exposing the router middleware
module.exports = router;
///////////////////////////////////////////////////////////