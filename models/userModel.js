///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const crypto = require('crypto');

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
        default: 'default.jpg'
    },
    password: {
        type: String,
        required: [true, 'Please provide a valid email'],
        minlength: 8,
        select: false
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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    following: [String],
    follower: [String],
    notification: [String],
    status: {
        type: String,
        default: "I am at saiyan level 1"
    }
});
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// this is presave middleware which will be envoked before saving the document
userSchema.pre('save', async function (next) {

    //will only run this function when password is modified
    if (!this.isModified('password')) {
        return next();
    }
    // here 12 is the cost factor
    this.password = await bcrypt.hash(this.password, 12);
    //setting it to undefined so that it will no store in database
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function (next) {

    //will only run this function when password is modified
    if (!this.isModified('password') || this.isNew) {
        return next();
    }
    this.passwordChangedAt = Date.now() - 1000;
    next();
});
///////////////////////////////////////////////////////////





///////////////////////////////////////////////////////////
// user method that will be available in all the instances
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function () {

    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Creating crew model
const User = mongoose.model('User', userSchema);
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Exposing crew model
module.exports = User;
///////////////////////////////////////////////////////////