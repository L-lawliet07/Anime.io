///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const catchAsync = require('./../utils/catchAsync');

const AppError = require('./../utils/appError');

const User = require('./../models/userModel');

const Message = require('./../models/message');

const FollowModel = require('./../models/followModel');

/////////////////////////////////////////////////////////// 
// This function will all use information
exports.getAllUser = catchAsync(
    async (req, res) => {
        const followingObject = await FollowModel.find({ follower: req.user.username });
        const following = followingObject.map(el => el.following);
        const users = await User.find({ $and: [{ username: { $ne: req.user.username } }, { username: { $nin: following } }] }).select(['username']);
        res
            .status(200)
            .render('people', {
                title: 'Anime.io | People',
                users,
                username: req.user.username
            });
    }
);
///////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////// 
// This function will all use information
exports.getAllFollowing = catchAsync(
    async (req, res) => {
        const users = await FollowModel.find({ follower: req.user.username }).select(['following']);
        res
            .status(200)
            .render('following', {
                title: 'Anime.io | Friends',
                users,
                username: req.user.username
            });
    }
);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function will update user data
exports.updateMe = catchAsync(
    async (req, res, next) => {
        let user = req.user;
        if (req.body.fullname && req.body.status) {
            user = await User.findByIdAndUpdate(req.user.id, { fullname: req.body.fullname, status: req.body.status }, {
                new: true
            });
        }
        res.status(200).json({
            status: 'success',
            user
        });
    }
);
///////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////// 
// This function will render login page
exports.profilePage = catchAsync(
    async (req, res, next) => {
        const username = req.params.username;
        const user = await User.findOne({ username }).select(['username', 'fullname', 'status', 'image', 'following', 'follower']);
        if (!user) {
            return next(new AppError('No User Found', 401));
        }
        res
            .status(200)
            .render('profile', {
                title: `Anime.io | ${username}`,
                user,
                username
            });
    }
);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function will render signup page
exports.settingPage = (req, res) => {
    res
        .status(200)
        .render('setting', {
            title: 'Anime.io | Setting',
            username: req.user.username
        });
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function will render all user info
exports.followUser = catchAsync(
    async (req, res) => {

        await FollowModel.create({ follower: req.user.username, following: req.body.username });
        res
            .status(200)
            .json({
                status: 'success',
                message: "Followed"
            });
    }
);

///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function will be render provate chat
exports.privateChat = catchAsync(

    async (req, res, next) => {

        /*
         * getting roomid 
         */
        const roomid = req.params.roomid;

        /*
         * spliting roomid into users
         */
        const users = roomid.split('-');

        /*
         * Error checks
         */
        if (users.length != 2 || users[0] !== req.user.username || users[0] === users[1]) {
            return next(new AppError('Page Not Found', 404));
        }

        const friend = await User.findOne({ username: users[1] });

        /*
         * Some more Error checks
         */
        if (!friend) {
            return next(new AppError('Page Not Found', 404));
        }

        /*
         * Retrieving previous messages
         */
        const old_message = await Message.aggregate([
            {
                $match: {
                    $and: [
                        { sender: { $in: [users[0], users[1]] } },
                        { receiver: { $in: [users[0], users[1]] } }
                    ]
                }
            },
            {
                $sort: {
                    createdAt: 1
                }
            },
        ]);

        res
            .status(200)
            .render('privateChat', {
                title: 'Anime.io | Chat',
                old_message,
                me: req.user.username,
                friend: (users[0] === req.user.username ? users[1] : users[0])
            });
    }
);
///////////////////////////////////////////////////////////