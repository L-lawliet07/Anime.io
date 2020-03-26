///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const multer = require('multer');

const sharp = require('sharp');

const catchAsync = require('./../utils/catchAsync');

const AppError = require('./../utils/appError');

const User = require('./../models/userModel');

const Message = require('./../models/message');

const FollowModel = require('./../models/followModel');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Please upload image!', 400), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(
    async (req, res, next) => {
        if (!req.file) return next();
        req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
        await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/images/people/${req.file.filename}`);
        next();
    }
);




/////////////////////////////////////////////////////////// 
// This function will all use information
exports.getAllUser = catchAsync(

    async (req, res) => {
        const followingObject = await FollowModel.find(
            {
                follower: req.user._id
            }
        );

        const following = followingObject.map(el => el.following);
        const users = await User.find({
            $and: [
                { username: { $ne: req.user.username } },
                { _id: { $nin: following } },
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

        const follower = req.user._id;
        const users = await FollowModel.aggregate([
            {
                $match: { follower }
            }
            ,
            {
                $lookup: {
                    from: 'users',
                    localField: 'following',
                    foreignField: '_id',
                    as: 'following'
                }
            },
            {
                $match: {
                    "following.username": {
                        $regex: (req.query.name ? req.query.name : ""), $options: "i"
                    }
                }
            }
        ]);

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
        if (!req.body.fullname) return next(new AppError('Fullname is required!', 400));
        let updataField = {};
        console.log(req.body);
        updataField.fullname = req.body.fullname;
        updataField.status = req.body.status;
        if (req.file) {
            updataField.image = req.file.filename;
        }
        user = await User.findByIdAndUpdate(req.user.id, updataField, {
            new: true,
            runValidators: true
        });

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

        const person = await User.findOne({ username: req.body.username });
        if (!person) {
            return next(new AppError(`Cannot find the user ${req.boby.username}`));
        }
        const followEntry = await FollowModel.findOne({
            $and: [
                { follower: req.user.id },
                { following: person._id }
            ]
        });

        if (followEntry) {
            return next(new AppError('Already a friend', 400));
        }
        await FollowModel.create({ follower: req.user.id, following: person._id });

        await User.updateOne({ _id: person._id }, { $push: { notification: `${req.user.username} started following you` } });

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

        const friend = await User.findOne({ username: users[1] }).select(['username', 'fullname', 'image', 'status']);

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
                friend
            });
    }
);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function is for private message
exports.privateMessage = catchAsync(
    async (req, res, next) => {

        await Message.create({
            sender: req.user.username,
            receiver: req.body.receiver,
            body: req.body.text
        });

        res
            .status(200)
            .json({
                status: 'success',
                message: "message saved to db"
            });
    }
);
///////////////////////////////////////////////////////////