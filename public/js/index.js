///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

import { login } from './login.js';
import { signup } from './signup.js';
import { logout } from './logout.js';
import { forgotpassword } from './forgotpassword.js';
import { resetpassword } from './resetpassword.js';
import { updateMe } from './setting.js';
import { follow } from './follow.js';
import { privateChat } from './privatechat.js';
import { groupChat } from './groupchat.js';


const io = require('socket.io-client');


///////////////////////////////////////////////////////////
// Elements

/* main_username element will contain username of the client */
const $main_username = document.getElementById('main-username');

const $loginForm = document.getElementById('login-form');

const $signupForm = document.getElementById('signup-form');

const $logoutButton = document.getElementById('logout-btn');

const $forgotForm = document.getElementById('forgot-form');

const $resetForm = document.getElementById('reset-form');

const $settingForm = document.querySelector('.setting-form');

const $followBtn = document.querySelectorAll('.follow-btn');

const $notificationBtn = document.querySelector('.notification-btn');

const $unseenmessageBtn = document.querySelector('.unseenmessage-btn');

const $groupChat = document.getElementById('groupChat');

const $privateChat = document.getElementById('privateChat');
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// connecting to root namesoace for global events
let global;
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Extracting username
let me;
if ($main_username) {

    /*
     * connecting to root namespace for global connection 
     */
    global = io('/')
    me = $main_username.textContent;
    /*
     * setting up  global connection 
     */
    global.emit('join', me);
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// listening for global socket events
if (global) {

    /*
     * listening to following-notification event that will be emitted when somebody follows the user 
     */
    global.on('following-notification', (user) => {

        const notificationIcon = document.getElementById('notification-icon');

        const notificationContainer = document.getElementById('notification-container');

        /* setting the color of the icon to red */
        notificationIcon.setAttribute('style', 'color: red;');

        const noNotification = document.querySelector('.no-notification');

        /* If there is no previous notification hide the no notification element */
        if (noNotification) {
            noNotification.setAttribute('style', 'display:none;');
        }

        const html = `<a class="dropdown-item" href="/user/profile/${user}">${user} started following you.</a>`;
        // inserting the notification
        notificationContainer.insertAdjacentHTML('afterbegin', html)
    });

    /*
     * listening to unseenmessage-notification event that will be emitted when user is offline from particular room and sombody sent a message 
     */
    global.on('unseenmessage-notification', (user) => {

        const unseenmessageIcon = document.getElementById('unseenmessage-icon');

        const notificationContainer = document.getElementById('unseenmessage-container');

        /* setting the color of the icon to red */
        unseenmessageIcon.setAttribute('style', 'color: red;');

        const noNotification = document.querySelector('.no-unseenMessage');

        /* If there is no previous notification hide the no notification element */
        if (noNotification) {
            noNotification.setAttribute('style', 'display:none;');
        }
        const html = `<a class="dropdown-item" href="/user/chat/${me}-${user}">${user} send you a message.</a>`;
        // inserting unseen message notification
        notificationContainer.insertAdjacentHTML('afterbegin', html)
    });
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// if $loginform element exists
if ($loginForm) {

    $loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // email and password provided by the user
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        login(email, password);
    });
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// is signup form element exists
if ($signupForm) {
    $signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullname = document.getElementById('fullname').value;

        const username = document.getElementById('username').value;

        const email = document.getElementById('email').value;

        const password = document.getElementById('password').value;

        const passwordConfirm = document.getElementById('passwordConfirm').value;

        signup(fullname, username, email, password, passwordConfirm);
    });
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
//  if logoutBtn element exists
if ($logoutButton) {
    $logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
//  if $forgotForm element exists
if ($forgotForm) {
    $forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const forgotBtn = document.getElementById('forgot-btn');

        forgotBtn.setAttribute('disabled', 'disabled');

        forgotBtn.innerText = 'Sending...';

        const email = document.getElementById('email').value;

        forgotpassword(email, forgotBtn);
    });
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// if $resetForm element exists
if ($resetForm) {
    $resetForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const password = document.getElementById('password').value;

        const passwordConfirm = document.getElementById('passwordConfirm').value;

        resetpassword(password, passwordConfirm);
    });
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// if $settingForm element exists
if ($settingForm) {
    $settingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // FormData interface provides a way to easily construct a set of key/value pairs representing form fields 
        const form = new FormData();

        form.append('fullname', document.getElementById('fullname').value);

        form.append('status', document.getElementById('status').value);

        form.append('photo', document.getElementById('photo').files[0]);

        updateMe(form);
    })
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// if $followBtn element exists
if ($followBtn.length > 0) {

    // iterating over all the $followBtn present in he page and adding event listner
    $followBtn.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const username = el.id;
            if (username) {
                follow(me, username, el, global);
            }
        });
    });
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// if $notificationBtn element exists
if ($notificationBtn) {
    $notificationBtn.addEventListener('click', (e) => {

        const notificationIcon = document.getElementById('notification-icon');
        // checking if any notification exist by checking the icon color
        if (notificationIcon.hasAttribute('style')) {
            notificationIcon.removeAttribute('style')

            const xhr = new XMLHttpRequest();

            // making a xhr request to clear notification from db 
            xhr.open('PATCH', '/user/clearnotification', true);

            xhr.send();
        }
    })
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// if $unseenmessageBtn element exists
if ($unseenmessageBtn) {
    $unseenmessageBtn.addEventListener('click', (e) => {
        const unseenmessageIcon = document.getElementById('unseenmessage-icon');
        // checking if any unseen message notification 
        if (unseenmessageIcon.hasAttribute('style')) {
            unseenmessageIcon.removeAttribute('style');
            const xhr = new XMLHttpRequest();
            xhr.open('PATCH', '/user/clearunseeenmessage', true);
            xhr.send();
        }
    });
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// if $groupChat element exists
if ($groupChat) {
    groupChat(io);
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// if $privateChat element exists
if ($privateChat) {
    privateChat(io, global);
}
///////////////////////////////////////////////////////////