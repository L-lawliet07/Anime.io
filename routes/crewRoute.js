///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const express = require('express');

/*
    crewController to controller crew Routes
*/
const crewController = require('../controllers/crewController');

///////////////////////////////////////////////////////////
// routes for view routes
const router = express.Router();

router
    .route('/')
    .get(crewController.homePage)
    .post(crewController.createCrew);

router
    .route('/:id')
    .get(crewController.getCrew)
    .patch(crewController.updateCrew)
    .delete(crewController.deleteCrew);

router
    .get('/:crewName/chat', crewController.chatRoom);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Exposing the router middleware
module.exports = router;
///////////////////////////////////////////////////////////