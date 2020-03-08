///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const express = require('express');

/*
    homeController to control home Routes
*/
const userController = require('./../controllers/userController');


///////////////////////////////////////////////////////////
// router for home routes
const router = express.Router();

router
    .get('/profile', userController.profilePage);
router
    .get('/setting', userController.settingPage)
    .post('/setting', userController.settingPage);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Exposing the router middleware
module.exports = router;
///////////////////////////////////////////////////////////