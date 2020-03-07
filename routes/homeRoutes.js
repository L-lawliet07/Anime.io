const express = require('express');

const homeController = require('../controllers/homeController');

const router = express.Router();

router
    .route('/')
    .get(homeController.getCrew)
    .post(homeController.createCrew); // Creating a new crew


////////////////////////////////////
// Updating Crew(group) details
// router
//     .route('/home/crews/:id')
//     .put(updateCrew);

router
    .route('/home/Shinobis')
    .get(homeController.getAllShinobi)

router
    .route('/home/Shinobis/:id')
    .get(homeController.getShinobi);

module.exports = router;