///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const AppError = require('./../utils/appError');

const jwt = require('jsonwebtoken');

const User = require('./../models/userModel');

const catchAsync = require('./../utils/catchAsync');

const { promisify } = require('util');

///////////////////////////////////////////////////////////
// function for signing token
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// signup
exports.signup = catchAsync(

    async (req, res, next) => {

        /*
         * create user
         */
        const user = await User.create(req.body);

        /*
         * if data is stored in db then assign a token to this user
         */
        const token = signToken(user._id);

        /*
         * sending back the 201 response with jwt token
         */
        res
            .status(201)
            .json({
                status: 'success',
                token,
                data: {
                    user
                }
            });
    }
);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// login
exports.login = catchAsync(

    async (req, res, next) => {

        /*
         * Check is email and password field exist
         */
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }

        /*
         * Check if user exists and password is correct
         */
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(new AppError('Incorrect email or password', 401));
        }

        /*
         * If every thing okay send token to the client
         */
        const token = signToken(user._id);
        res
            .status(200)
            .json({
                status: 'success',
                token
            });
    }
);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Function to check if user have permission to pass this middleware
exports.protect = catchAsync(
    async (req, res, next) => {

        /*
         * getting the token and checking if token field exists
         */
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token)
            return next(new AppError('You are not logged in', 401));

        /*
         * Validating the token
         */
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        /*
         * Check is user exist
         */
        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new AppError('User no longer exist', 401));
        }

        /*
         * if user change password after the jwt was issued
         */
        if (user.changedPasswordAfter(decoded.iat)) {
            return next(new AppError('Password Changed! Please login again', 401));
        }

        //Attaching user info to request object
        req.user = user;

        /*
         * if everything okay pass it to next middleware
         */
        next();
    }
);
///////////////////////////////////////////////////////////