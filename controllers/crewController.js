///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const AppError = require('./../utils/appError');

const catchAsync = require('./../utils/catchAsync');

const Crew = require('./../models/crewModel');

const CrewMessage = require('./../models/crewMessage');

///////////////////////////////////////////////////////////
// This function will render home page of the application
exports.homePage = catchAsync(
    async (req, res) => {

        /*
         * Searching crew info based on query string provided
         */
        const crews = await Crew.find(
            {
                "name": {
                    "$regex": (req.query.name ? req.query.name : ""), "$options": "i"
                }
            }
        );

        /*
         * Sending response back
         */
        res
            .status(200)
            .render('./home', {
                title: 'Anime.io | home',
                crews,
                user: req.user
            });
    }
);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function is to create new Crew
exports.createCrew = catchAsync(
    async (req, res) => {

        /*
         * Creating new crew
         */
        const crewData = await Crew.create(req.body);

        /*
         * Sending response back
         */
        res
            .status(201)
            .json({
                status: 'success',
                data: {
                    crew: crewData
                }
            });
    }
);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function will find crew by id and update it
exports.updateCrew = catchAsync(

    async (req, res) => {

        /*
         * finding and updating crew data
         */
        const crewData = await Crew.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        /*
         * Checking if crew exist
         */
        if (!crewData) {
            return next(new AppError(`No crew Found with id ${req.params.id}`, 404));
        }

        /*
         * Sending response back
         */
        res
            .status(200)
            .json({
                status: 'success',
                data: {
                    crew: crewData
                }
            });
    }
);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function will find crew by id and delete it
exports.deleteCrew = catchAsync(
    async (req, res) => {

        /*
         * Find crew by and delete
         */
        const crewData = await Crew.findByIdAndDelete(req.params.id);

        /*
         * Checking if crew exist
         */
        if (!crewData) {
            return next(new AppError(`No crew Found with id ${req.params.id}`, 404));
        }

        /*
         * Sending response back
         */
        res
            .status(204)
            .json({
                status: 'success',
            });
    }
);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function will find crew by id
exports.getCrew = catchAsync(
    async (req, res, next) => {

        /*
         * Finding crew data 
         */
        const crewData = await Crew.findById(req.params.id);

        /*
         * Checking if crew exist
         */
        if (!crewData) {
            return next(new AppError(`No crew Found with id ${req.params.id}`, 404));
        }

        /*
         * Sending response back
         */
        res
            .status(200)
            .json({
                status: 'success',
                data: {
                    crew: crewData
                }
            });
    }
);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function will render crewChatRoom page
exports.chatRoom = catchAsync(
    async (req, res, next) => {

        const crewName = req.params.crewName

        /*
         * Checking if the crew exist or not
         */

        const crew = await Crew.findOne({ name: crewName });

        if (!crew) {
            return next(new AppError('Page Not Found', 404));
        }

        /*
         * getting old message for particular crew sorted in ascending order
         */
        const old_message = await CrewMessage.aggregate([
            {
                $match: {
                    crew: crew.name
                }
            },
            {
                $sort: {
                    createdAt: 1
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'sender'
                }
            }
        ]);

        /*
         * Sending response back
         */
        res
            .status(200)
            .render('groupchat', {
                title: `Anime.io | ${crew.name}`,
                crew,
                user: req.user,
                old_message
            });
    }
);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function will handle crewMessaage
exports.crewMessage = catchAsync(
    async (req, res) => {

        const crew = req.body.crew;
        const message = req.body.text;

        /*
         * storing crew message in crewmessages collections
         */
        await CrewMessage.create({
            sender: req.user.id,
            crew,
            body: message
        });

        /*
         * Sending response back
         */
        res
            .status(200)
            .json({
                status: 'success',
            });
    }
);
///////////////////////////////////////////////////////////