const express = require('express');

const router = express.Router();

router
    .route('/home')
    .get(getCrew)
    .post(createCrew); // Creating a new crew


////////////////////////////////////
// Updating Crew(group) details
// router
//     .route('/home/crews/:id')
//     .put(updateCrew);

router
    .route('/home/Shinobis')
    .get(getAllShinobi)

router
    .route('/home/Shinobis/:id')
    .get(getShinobi);

module.exports = router;