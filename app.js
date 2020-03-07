/////////////////////////////////////
// @author : Mandeep Bisht
/////////////////////////////////////


const express = require('express');

const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');
const homeRoutes = require('./routes/homeRoutes');
const viewRoutes = require('./routes/viewRoutes');


const app = express();

/////////////////////////////////////
// Middleware   
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static('public'));
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// app.use('/', viewRoutes);
app.use('/home', homeRoutes);
// app.use('/users', userRoutes);

module.exports = app;