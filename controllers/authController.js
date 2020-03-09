///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const AppError = require('./../utils/appError');

const jwt = require('jsonwebtoken');

const User = require('./../models/userModel');

const catchAsync = require('./../utils/catchAsync');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

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


