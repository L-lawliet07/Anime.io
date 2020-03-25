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

        const crews = await Crew.find({ "name": { "$regex": (req.query.name ? req.query.name : ""), "$options": "i" } });
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

        const crewData = await Crew.create(req.body);
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

        const crewData = await Crew.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!crewData) {
            return next(new AppError(`No crew Found with id ${req.params.id}`, 404));
        }
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

        const crewData = await Crew.findByIdAndDelete(req.params.id);
        if (!crewData) {
            return next(new AppError(`No crew Found with id ${req.params.id}`, 404));
        }
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

        const crewData = await Crew.findById(req.params.id);
        if (!crewData) {
            return next(new AppError(`No crew Found with id ${req.params.id}`, 404));
        }
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
    async (req, res) => {
        const crew = req.params.crewName
        const old_message = await CrewMessage.aggregate([
            { $match: { crew } },
            { $sort: { createdAt: 1 } }
        ]);
        res
            .status(200)
            .render('groupchat', {
                title: `Anime.io | ${crew}`,
                crew,
                user: req.user,
                old_message
            });
    }
);

///////////////////////////////////////////////////////////