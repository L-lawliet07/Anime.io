///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const express = require('express');

/*
 * userController to control user Routes
 */
const userController = require('../controllers/userController');

const authController = require('../controllers/authController');

///////////////////////////////////////////////////////////
// router for home routes
const router = express.Router();

/*
 * These are all unprotected routes anyone can access them
 */
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword', authController.resetPassword);
/*********************************************************/


/*
 * These are all protected routes only authorized user can access them
 */
router
    .get('/profile/:username', authController.protect, userController.profilePage);

router
    .route('/setting')
    .get(authController.protect, userController.settingPage)
    .patch(
        authController.protect,
        userController.uploadUserPhoto,
        userController.resizeUserPhoto,
        userController.updateMe
    );

router
    .get('/users', authController.protect, userController.getAllUser);

router
    .patch('/clearnotification', authController.protect, userController.clearNotification);

router
    .patch('/clearunseeenmessage', authController.protect, userController.clearUnseenMessage);

router
    .get('/chat/:roomid', authController.protect, userController.privateChat);

router
    .post('/chat/message', authController.protect, userController.privateMessage);

router
    .patch('/chat/message/notification', authController.protect, userController.privateMessageNotificaton);

router
    .get('/friend', authController.protect, userController.getAllFollowing);

router
    .patch('/follow', authController.protect, userController.followUser);
/*********************************************************/

///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Exposing the router middleware
module.exports = router;
///////////////////////////////////////////////////////////