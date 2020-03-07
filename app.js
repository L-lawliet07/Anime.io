/////////////////////////////////////
// @author : Mandeep Bisht
/////////////////////////////////////

const fs = require('fs');

const express = require('express');

const morgan = require('morgan');

const app = express();
// 1) Middlewares  
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

const crewData = JSON.parse(
    fs.readFileSync('./dev-data/crews.json')
);


const getCrew = (req, res) => {

    res
        .status(200)
        .json(
            {
                status: 'success',
                requestTime: req.requestTime,
                results: crewData.length,
                data: {
                    crewData
                }
            }
        );
}

const createCrew = (req, res) => {

    res
        .status(201)
        .json({
            status: 'success',
            message: 'Created'
        });
}

const updateCrew = (req, res) => {
    res
        .status(201)
        .json({
            status: 'success',
            message: 'Updated'
        });
};

app
    .route('/home/crews')
    .get(getCrew)
    .post(createCrew)

app
    .route('/home/:id')
    .put(updateCrew)


const port = 3000;

app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});