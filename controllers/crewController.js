
///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const Crew = require('./../models/crewModel');

///////////////////////////////////////////////////////////
// This function will render home page of the application
exports.homePage = async (req, res) => {

    const data = await Crew.find({});
    res
        .status(200)
        .json(data);
};
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function is to create new Crew
exports.createCrew = async (req, res) => {

    try {
        const crewData = await Crew.create(req.body);
        res
            .status(201)
            .json({
                status: 'success',
                data: {
                    crew: crewData
                }
            });
    } catch (err) {
        res
            .status(400)
            .json({
                status: 'fail',
                error: err
            });
    }
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function will find crew by id and update it
exports.updateCrew = async (req, res) => {

    try {
        const crewData = await Crew.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res
            .status(200)
            .json({
                status: 'success',
                data: {
                    crew: crewData
                }
            });
    } catch (err) {
        res
            .status(400)
            .json({
                status: 'fail',
                error: err
            });
    }
}
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
// This function will find crew by id and delete it
exports.deleteCrew = async (req, res) => {

    try {
        await Crew.findByIdAndDelete(req.params.id);
        res
            .status(204)
            .json({
                status: 'success',
            });
    } catch (err) {
        res
            .status(400)
            .json({
                status: 'fail',
                error: err
            });
    }
}
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
// This function will find crew by id
exports.getCrew = async (req, res) => {

    try {
        const crewData = await Crew.findById(req.params.id);
        res
            .status(200)
            .json({
                status: 'success',
                data: {
                    crew: crewData
                }
            });
    } catch (err) {
        res
            .status(400)
            .json({
                status: 'fail',
                error: err
            });
    }
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function will render crewChatRoom page
exports.chatRoom = (req, res) => {
    res
        .status(404)
        .json({
            message: "This path is underconstruction"
        });
}
///////////////////////////////////////////////////////////