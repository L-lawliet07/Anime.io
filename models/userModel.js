///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const mongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

///////////////////////////////////////////////////////////
// Creating a crew schema
const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: [true, 'Please tell us your name'],
        unique: true
    },
    fullname: {
        type: String,
        required: [true, 'Please tell us your fullname']
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
    password: {
        type: String,
        required: [true, 'Please provide a valid email'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please provide a valid email'],
        validate: {
            // @note : This will only work on save or create 
            validator: function (el) {
                return el === this.password;
            },
            message: "Passwords are not same"
        }
    },
    friends: [String]
});
///////////////////////////////////////////////////////////


userSchema.pre('save', async function (next) {

    //will only run this function when password is modified
    if (!this.isModified('password')) {
        return next();
    }
    // here 12 is the cost factor
    this.password = await bcrypt.hash(this.password, 12);
    //setting it to undefined so that it will no store in database
    this.passwordConfirm = undefined;
    console.log('inside');
    next();
});


///////////////////////////////////////////////////////////
// Creating crew model
const User = mongoose.model('User', userSchema);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Exposing crew model
module.exports = User;
///////////////////////////////////////////////////////////