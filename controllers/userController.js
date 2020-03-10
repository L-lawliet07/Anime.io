
///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const catchAsync = require('./../utils/catchAsync');

const User = require('./../models/userModel');

/////////////////////////////////////////////////////////// 
// This function will all use information
exports.getAllUser = catchAsync(
    async (req, res) => {
        const users = await User.find();
        res
            .status(200)
            .json({
                status: 'success',
                results: users.length,
                data: {
                    users
                }
            });
    }
);
///////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////// 
// This function will render login page
exports.profilePage = (req, res) => {
    res
        .status(404)
        .json({
            message: "This path is underconstruction"
        });
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function will render signup page
exports.settingPage = (req, res) => {
    res
        .status(404)
        .json({
            message: "This path is undercontruction"
        });
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function will render all user info
exports.usersPage = (req, res) => {
    res
        .status(404)
        .json({
            message: "This path is undercontruction"
        });
}
///////////////////////////////////////////////////////////