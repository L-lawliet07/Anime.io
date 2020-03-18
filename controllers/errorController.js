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
    return new AppError(`${Object.keys(err.keyValue)[0]} already in use`, 400)
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
// handling JWT Error
const handleJWTError = () => {
    return new AppError(`Invalid token please login`, 401);
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// handling JWT Expired Error
const handleJWTExpiredError = () => {
    return new AppError(`Token expired`, 401);
}
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
// This function will send production error 
const sendProductionError = (err, res) => {

    if (err.isOperational) {
        if (err.statusCode === 404) {
            return res.render('404', {
                title: 'Anime | 404'
            });
        }
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

    /* **** If environment is development **** */
    if (process.env.NODE_ENV === 'development') {
        sendDevelopmentError(err, res);
    }
    /* **** If environment is production **** */
    else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;
        /*
         * Checking if there is CastError thrown by mongoose for invalid id
         */
        if (error.name === 'CastError') {
            error = handleCastErrorDB(error)
        }

        /*
         * Checking if there is Duplicate Field error thrown by mongodb
         */
        if (error.code === 11000) {
            error = handleDuplicateFieldDB(error);
        }

        /*
         * Checking if there is Validation error thrown by mongoose
         */
        if (error.name === 'ValidationError') {
            error = handleValidationErrorDB(error)
        }

        /*
         * Checking if there is Json Web Token error 
         */
        if (error.name === 'JsonWebTokenError') {
            error = handleJWTError();
        }

        /*
         * Checking if there is Json Web Token error 
         */
        if (error.name === 'TokenExpiredError') {
            error = handleJWTExpiredError();
        }

        sendProductionError(error, res);
    }
};
///////////////////////////////////////////////////////////