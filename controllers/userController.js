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


///////////////////////////////////////////////////////////
//  setting up storage option
const multerStorage = multer.memoryStorage();
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// setting up multer fillter
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Please upload image!', 400), false);
    }
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
//upload object to upload file
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// middle ware to parse multipart form data ( single file )
exports.uploadUserPhoto = upload.single('photo');
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This will resize and reformat the image
exports.resizeUserPhoto = catchAsync(
    async (req, res, next) => {

        /*
         * checing if file field exist
         */
        if (!req.file)
            return next();

        /*
         * setting up the filename
         */
        req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

        /*
         * configuring sharp to process image
         */
        await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/images/people/${req.file.filename}`);

        next();
    }
);
///////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////// 
// This function will all use information
exports.getAllUser = catchAsync(

    async (req, res) => {

        /*
         * Find all persons who are followed by the user
         */
        const followingObject = await FollowModel.find(
            {
                follower: req.user._id
            }
        );

        /*
         * find all the users which are not friend of user and match the following 
         */
        const following = followingObject.map(el => el.following);
        const users = await User.find(
            {
                $and: [
                    { username: { $ne: req.user.username } },
                    { _id: { $nin: following } },
                    { username: { $regex: (req.query.name ? req.query.name : ""), $options: "i" } }
                ]
            }
        ).select(['username', 'image']);

        /*
         * Sending response back
         */
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

        /*
         * Finding all the folllwing of user
         */
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

        /*
         * Sending response back
         */
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

        /*
         * checking if fullname is entry is filled or not
         */
        let user = req.user;
        if (!req.body.fullname) return next(new AppError('Fullname is required!', 400));

        /*
         * setting up the fields to update
         */
        let updataField = {};
        updataField.fullname = req.body.fullname;
        updataField.status = req.body.status;

        // if file fields exist that means user is also uploading new image
        if (req.file) {
            updataField.image = req.file.filename;
        }

        /*
         *  updating user info 
         */
        user = await User.findByIdAndUpdate(req.user.id, updataField, {
            new: true,
            runValidators: true
        });

        /*
         * Sending response back
         */
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

        /*
         * getting user info based on username 
         */
        const username = req.params.username;
        const profile = await User.findOne({ username }).select(['username', 'fullname', 'status', 'image', '_id']);

        /*
         * checking if profile exist 
         */
        if (!profile) {
            return next(new AppError('No User Found', 400));
        }

        /*
         *  Find all the follwer and following of particular user 
         */
        const [follower, following] = await Promise.all(
            [
                FollowModel.find({ following: profile._id }).populate('follower').select('follower'),
                FollowModel.find({ follower: profile._id }).populate('following').select('following')
            ]
        )

        /*
         * Sending response back
         */
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

    /*
     * Sending response back
     */
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

        /*
         *  Getting followed user info 
         */
        const person = await User.findOne({ username: req.body.username });

        /*
         *  Checking person exist or not 
         */
        if (!person) {
            return next(new AppError(`Cannot find the user ${req.boby.username}`));
        }

        /*
         *  check if this entry already exist or not 
         */
        const followEntry = await FollowModel.findOne({
            $and: [
                { follower: req.user.id },
                { following: person._id }
            ]
        });

        // if entry already exist 
        if (followEntry) {
            return next(new AppError('Already a friend', 400));
        }

        /*
         *  creating following relation and pushing notification to db 
         */
        await Promise.all([
            FollowModel.create({ follower: req.user.id, following: person._id }),
            User.updateOne({ _id: person._id }, { $push: { notification: req.user.username } })
        ]);


        /*
         * Sending response back
         */
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
// This function will clear all the notification stored in db 
exports.clearNotification = catchAsync(
    async (req, res, next) => {

        /*
         * find and updating user collection. basically deleting all the notification entry 
         */
        await User.updateOne({ _id: req.user._id }, { $set: { notification: [] } });

        /*
         * Sending response back
         */
        res
            .status(200)
            .json({
                status: 'success',
                message: "notificatin clear"
            });
    }
);
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
// This function will clear all the notification stored in db 
exports.clearUnseenMessage = catchAsync(
    async (req, res, next) => {

        /*
         * find and updating user collection. basically deleting all he unseen message entry
         */
        await User.updateOne({ _id: req.user._id }, { $set: { unseenMessage: [] } });

        /*
         * Sending response back
         */
        res
            .status(200)
            .json({
                status: 'success',
                message: "unseen message notificatin clear"
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

        /*
         * Sending response back
         */
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

        /*
         * creating new message entry in message collection
         */
        await Message.create({
            sender: req.user.username,
            receiver: req.body.receiver,
            body: req.body.text
        });

        /*
         * Sending response back
         */
        res
            .status(200)
            .json({
                status: 'success',
                message: "message saved to db"
            });
    }
);
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
// This function will store the private message notification
exports.privateMessageNotificaton = catchAsync(


    async (req, res) => {

        /*
         * Finding to person and pushing notification
         */
        const person = await User.findOneAndUpdate(
            {
                username: req.body.receiver
            },
            {
                $push: {
                    unseenMessage: req.user.username
                }
            }
        );

        // checking if user exist or not
        if (!person) {
            return next(new AppError(`Cannot find the user ${req.boby.receiver}`, 400));
        }

        /*
         * Sending response back
         */
        res
            .status(200)
            .json({
                status: 'success',
                message: "Message notification saved"
            });
    }
);
///////////////////////////////////////////////////////////