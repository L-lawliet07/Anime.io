///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function will render home page of the application
exports.homePage = (req, res) => {
    res
        .status(404)
        .json({
            message: 'this route is under construction'
        });
};
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function will render all the user page
exports.userPage = (req, res) => {
    res
        .status(404)
        .json({
            message: 'this route is under construction'
        });
};
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function will render search Result
exports.resultPage = (req, res) => {
    res
        .status(404)
        .json({
            message: 'this route is under construction'
        });
};
///////////////////////////////////////////////////////////


// exports.createCrew = async (req, res) => {

//     try {
//         const newCrew = await Crew.create(req.body);
//         res.status(201).json({
//             status: 'success',
//             data: {
//                 crew: newCrew
//             }
//         });
//     } catch (err) {
//         res.status(400).json({
//             status: 'fail',
//             message: err
//         })
//     };
// };

// exports.getAllShinobi = (req, res) => {
//     res
//         .status(404)
//         .json({
//             message: 'This route is under construction'
//         });
// };


// exports.getShinobi = (req, res) => {
//     res
//         .status(404)
//         .json({
//             message: 'This route is under construction'
//         });
// }