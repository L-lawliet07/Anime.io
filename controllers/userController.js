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
        const users = await User.find({
            $and: [
                { username: { $ne: req.user.username } },
                { username: { $nin: following } },
                { username: { $regex: (req.query.name ? req.query.name : ""), $options: "i" } }
            ]
        }
        ).select(['username', 'image']);

        res
            .status(200)
            .render('people', {
                title: 'Anime.io | People',
                user: req.user,
                users
            });
    }
);
///////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////// 
// This function will all use information
exports.getAllFollowing = catchAsync(
    async (req, res) => {

        const users = await FollowModel.find(
            {
                $and: [
                    { follower: req.user.username },
                    { following: { $regex: (req.query.name ? req.query.name : ""), $options: "i" } }
                ]
            }
        ).select(['following']);

        res
            .status(200)
            .render('following', {
                title: 'Anime.io | Friends',
                user: req.user,
                users
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
            user = await User.findByIdAndUpdate(req.user.id, {
                fullname: req.body.fullname,
                status: req.body.status
            }, {
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
        const profile = await User.findOne({ username }).select(['username', 'fullname', 'status', 'image']);
        if (!profile) {
            return next(new AppError('No User Found', 401));
        }
        const follower = await FollowModel.find({ following: username }).select(['follower']);
        const following = await FollowModel.find({ follower: username }).select(['following']);
        console.log(follower);
        console.log(following);
        res
            .status(200)
            .render('profile', {
                title: `Anime.io | ${username}`,
                profile,
                user: req.user,
                follower,
                following
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
            user: req.user
        });
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function will render all user info
exports.followUser = catchAsync(
    async (req, res, next) => {

        const followEntry = await FollowModel.findOne({
            $and: [
                { follower: req.user.username },
                { following: req.body.username }
            ]
        });

        if (followEntry) {
            return next(new AppError('Already a friend', 400));
        }
        await FollowModel.create({ follower: req.user.username, following: req.body.username });
        console.log(req.body.username);
        await User.updateOne({ username: req.body.username }, { $push: { notification: `${req.user.username} started following you` } });
        res
            .status(200)
            .json({
                status: 'success',
                message: "Followed"
            });
    }
);
///////////////////////////////////////////////////////////


exports.clearNotification = catchAsync(
    async (req, res, next) => {
        await User.updateOne({ _id: req.user._id }, { $set: { notification: [] } })
        res
            .status(200)
            .json({
                status: 'success',
                message: "notificatin clear"
            });
    }
);

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
                user: req.user,
                friend: (users[0] === req.user.username ? users[1] : users[0])
            });
    }
);
///////////////////////////////////////////////////////////