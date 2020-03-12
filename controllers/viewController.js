///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
// This function will render login page
exports.loginPage = function (req, res) {
    res
        .status(200)
        .render('./login', {
            title: 'Anime.io | login'
        });
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function will render signup page
exports.signupPage = function (req, res) {
    res
        .status(200)
        .render('./signup', {
            title: 'Anime.io | signup'
        })
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function will render signup page
exports.forgotPasswordPage = function (req, res) {
    res
        .status(200)
        .render('./forgotpassword', {
            title: 'Anime.io'
        })
}
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
// This functin will render password reset page
exports.resetPasswordPage = function (req, res) {

    const cookie_option = {
        expires: new Date(
            Date.now() + 10 * 60 * 1000
        ),
        httpOnly: true
    };

    res.cookie('resetToken', req.params.token, cookie_option);
    // if (process.env.NODE_ENV == 'production') cookie_option.secure = true;

    res
        .status(200)
        .render('./resetpassword', {
            title: 'Anime.io'
        })
}
///////////////////////////////////////////////////////////
