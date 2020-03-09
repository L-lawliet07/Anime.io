///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const AppError = require('./../utils/appError');

///////////////////////////////////////////////////////////
// handling cast error produced by mongoose
const handleCastErrorDB = (err) => {
    return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// handling duplicate field error produced by mongodb
const handleDuplicateFieldDB = (err) => {
    return new AppError(`Duplicate Field value `, 400)
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// handling validation error produced by mongoose
const handleValidationErrorDB = (err) => {

    const errors = Object.values(err.errors).map(el => el.message);

    return new AppError(`Invalid input data.${errors.join(',')}`, 400);
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function will send production error 
const sendProductionError = (err, res) => {

    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.error('ERROR : ', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function will send development error
const sendDevelopmentError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// global Error handler
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendDevelopmentError(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        if (error.name === 'CastError') {
            error = handleCastErrorDB(error)
        }
        if (error.code === 11000) {
            error = handleDuplicateFieldDB(error);
        }
        if (error.name === 'ValidationError') {
            error = handleValidationErrorDB()
        }
        sendProductionError(error, res);
    }
};
///////////////////////////////////////////////////////////