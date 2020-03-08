///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const mongoose = require('mongoose');

///////////////////////////////////////////////////////////
// Creating a crew schema
const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: [true, 'Crew name is required'],
        unique: true
    },
    fullname: {

    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    image: {
        type: String,
        default: 'default.png'
    },
    friends: [String]
});
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Creating crew model
const User = mongoose.model('User', userSchema);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Exposing crew model
module.exports = User;
///////////////////////////////////////////////////////////