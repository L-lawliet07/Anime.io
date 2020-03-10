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
        const user = await User.create(req.body);
        const token = signToken(user._id);
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
        const { email, password } = req.body;
        // 1) if email and exist
        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }
        // 2) check if user exists && password is correct
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(new AppError('Incorrect email or password', 401));
        }

        // 3) if everything ok, send token to client
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
// 
exports.protect = catchAsync(
    async (req, res, next) => {
        // 1) getting the token
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) return next(new AppError('You are not logged in', 401));
        // 2) validate the token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        // 3) check if user exist
        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new AppError('User no longer exist', 401));
        }
        // 4) if user change password after the jwt was issued
        if (user.changedPasswordAfter(decoded.iat)) {
            return next(new AppError('Password Changed! Please login again', 401));
        }
        req.user = user;
        next();
    }
);
///////////////////////////////////////////////////////////