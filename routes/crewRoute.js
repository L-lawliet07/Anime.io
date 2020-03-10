///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const express = require('express');

/*
    crewController to controller crew Routes
*/
const crewController = require('./../controllers/crewController');

const authController = require('./../controllers/authController');

///////////////////////////////////////////////////////////
// routes for view routes
const router = express.Router();

router
    .route('/')
    .get(authController.protect, crewController.homePage)
    .post(authController.protect, crewController.createCrew);

router
    .route('/:id')
    .get(authController.protect, crewController.getCrew)
    .patch(authController.protect, crewController.updateCrew)
    .delete(authController.protect, crewController.deleteCrew);

router
    .get('/:crewName/chat', authController.protect, crewController.chatRoom);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Exposing the router middleware
module.exports = router;
///////////////////////////////////////////////////////////