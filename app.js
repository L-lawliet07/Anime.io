/////////////////////////////////////
// @author : Mandeep Bisht
/////////////////////////////////////

const fs = require('fs');

const express = require('express');

const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');
const homeRoutes = require('./routes/homeRoutes');
const viewRoutes = require('./routes/viewRoutes');


const app = express();

/////////////////////////////////////
// Middleware   
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/', viewRoutes);
app.use('/home', homeRoutes);
app.use('/users', userRoutes);

module.exports = app;