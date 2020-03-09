///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const path = require('path');

const express = require('express');

const morgan = require('morgan');


///////////////////////////////////////////////////////////
// Routes
const userRoute = require('./routes/userRoute');
const viewRoute = require('./routes/viewRoute');
const crewRoute = require('./routes/crewRoute');
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Starting express app
const app = express();
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Running morgan for only development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// For parsing json request body
app.use(express.json());
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// middleware to set requestTime in request object
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Setting up Routes
app.use('/', viewRoute);
app.use('/crew', crewRoute);
app.use('/user', userRoute);
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
// Exposing express app to other modules 
module.exports = app;
///////////////////////////////////////////////////////////