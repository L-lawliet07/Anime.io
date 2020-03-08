
///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const Crew = require('./../models/crewModel');

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


///////////////////////////////////////////////////////////
// This function is to create new Crew
exports.createCrew = async (req, res) => {

    try {
        const crewData = await Crew.create(req.body);
        res
            .status(201)
            .json({
                status: 'status',
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