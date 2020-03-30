///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const express = require('express');

const crewController = require('./../controllers/crewController');

const authController = require('./../controllers/authController');

///////////////////////////////////////////////////////////
// routes for crew routes
const router = express.Router();

router
    .route('/')
    .get(authController.protect, crewController.homePage)
    .post(authController.protect, crewController.createCrew);

router
    .route('/chat/message')
    .post(authController.protect, crewController.crewMessage);

router
    .route('/:id')
    .get(authController.protect, crewController.getCrew)
    .patch(authController.protect, crewController.updateCrew)
    .delete(authController.protect, authController.adminSection, crewController.deleteCrew);

router
    .get('/chat/:crewName', authController.protect, crewController.chatRoom);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Exposing the router middleware
module.exports = router;
///////////////////////////////////////////////////////////