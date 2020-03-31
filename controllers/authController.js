///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const AppError = require('./../utils/appError');

const jwt = require('jsonwebtoken');

const crypto = require('crypto');

const User = require('./../models/userModel');

const catchAsync = require('./../utils/catchAsync');

const sendEmail = require('./../utils/email');

const { promisify } = require('util');

///////////////////////////////////////////////////////////
// function for signing token
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// function that will create and send jwt token 
const createSendToken = (user, statusCode, res) => {

    /*
     * creating token
     */
    const token = signToken(user._id);

    /*
     * setting up cookie options
     */
    const cookie_option = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    /*
     * setting secure cookie option only in production
     */
    if (process.env.NODE_ENV == 'production') cookie_option.secure = true;
    //setting cookie
    res.cookie('jwt', token, cookie_option);
    //not sending passsword to the user
    user.password = undefined;
    //sending the json response
    res
        .status(statusCode)
        .json({
            status: 'success',
            token,
            data: {
                user
            }
        });
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// signup function to create new user
exports.signup = catchAsync(

    async (req, res, next) => {

        /*
         * create user
         */
        const user = await User.create(req.body);
        /*
         * signing token and sending back the 201 response with jwt token
         */
        createSendToken(user, 201, res)
    }
);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// login controller to log the user in
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
        const user = await User.findOne(
            {
                email
            }
        ).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(new AppError('Invalid email or password', 401));
        }

        /*
         * If every thing okay send token to the client
         */
        createSendToken(user, 200, res)
    }
);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// logOut function to log user out
exports.logout = (req, res, next) => {

    /*
     * setting cookie to some other value and 10 sec expiredate
     */
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    /*
     * sending success respose back
     */
    res
        .status(200)
        .json({ status: 'success' });
};
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Function to check if user have permission to pass this middleware
exports.protect = catchAsync(
    async (req, res, next) => {

        /*
         * getting the token and checking if token field exists
         */
        let token;
        // Checking authorization headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Checking jwt cookie
        else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        // If no token exist that means user is not logged in
        if (!token)
            return next(new AppError('Please login first', 401));

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


///////////////////////////////////////////////////////////
// Checking if user is admin or not
exports.adminSection = (req, res, next) => {
    /*
     * Check if it is admin
     */
    if (false) {
        next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// this will function will 
exports.forgotPassword = catchAsync(
    async (req, res, next) => {

        /*
         * Check if mail is provided
         */
        const { email } = req.body;
        if (!email) {
            return next(new AppError('Email is required', 401));
        }

        /*
         * Check if email exist in databases
         */
        const user = await User.findOne({ email });
        if (!user) {
            return next(new AppError('Email is not yet registered!', 400));
        }

        /*
         * generate the random reset token 
         */

        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });
        /*
         * send this token to the user 
         */

        // creating the reset url
        const resetURL = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;

        // creating message text
        const message = `Click here to recover password ${resetURL}`;

        try {
            // sending mail
            await sendEmail({
                email: user.email,
                subject: 'Password Recovery link below will be valid for 10 min',
                message
            });
            // now sending the response
            res.status(200).json({
                status: 'success',
                message: 'Token Sent'
            });
        } catch (err) {

            // if some error occurs setting below value to undefined
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            // we are saving the changes
            await user.save({ validateBeforeSave: false });

            return next(new AppError('Unable to send mail', 500));
        }
    }
);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// this will function will 
exports.resetPassword = catchAsync(
    async (req, res, next) => {

        /*
         * checking token cookie
         */
        const token = req.cookies.resetToken;
        if (!token) {
            return next(new AppError('Token is invalid or has expored'), 400);
        }
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        /*
         * find user based on the token provided
         */
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        /*
         * checking if use exists or not
         */
        if (!user) {
            return next(new AppError('Token is invalid or has expored', 400));
        }

        /*
         * upating the password
         */
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        /*
         * changing reset token
         */
        res.cookie('resetToken', 'tokenExpired', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });
        createSendToken(user, 200, res);
    }
);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Function to check if user have permission to pass this middleware
exports.isLoggedin = catchAsync(
    async (req, res, next) => {
        if (req.cookies.jwt) {

            try {

                /*
                 * Validating the token
                 */
                const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
                /*
                 * Check is user exist
                 */
                const user = await User.findById(decoded.id);
                if (!user)
                    return next();
                /*
                 * if user change password after the jwt was issued
                 */
                if (user.changedPasswordAfter(decoded.iat)) {
                    return next();
                }
                //Attaching user info to request object
                req.user = user;
                res.redirect('/crew');
            } catch (err) {
                return next();
            }
        } else {
            next();
        }
    }
);
///////////////////////////////////////////////////////////