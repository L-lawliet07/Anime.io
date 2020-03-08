///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const express = require('express');

const viewController = require('./../controllers/viewController');

const router = express.Router();


router.get('/login', viewController.loginPage);
router.get('/', viewController.loginPage);
router.get('/signup', viewController.signupPage);

module.exports = router;