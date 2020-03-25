import { login } from './login.js'
import { signup } from './signup.js';
import { logout } from './logout.js';
import { forgotpassword } from './forgotpassword.js'
import { resetpassword } from './resetpassword.js'
import { updateMe } from './setting.js'
import { follow } from './follow.js'
const io = require('socket.io-client');

const main_username = document.getElementById('main-username');
const socket = io('/');
let me;
if (main_username) {
    me = main_username.textContent;
    socket.emit('join', me);
}


socket.on('following-notification', (notification) => {
    // const notificationIcon = document.getElementById('notification-icon');
    // const notificationContainer = document.getElementById('notification-container');
    // notificationIcon.setAttribute('style', 'color: red;');
    // const html = `<a class="dropdown-item" href="">${notification}</a>`;
    // notificationContainer.insertAdjacentElement('afterbegin', html);
});

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const logoutButton = document.getElementById('logout-btn');
const forgotForm = document.getElementById('forgot-form');
const resetForm = document.getElementById('reset-form');
const settingForm = document.querySelector('.setting-form');
const followBtn = document.querySelector('.follow-btn');
const notificationBtn = document.querySelector('.notification-btn');


if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullname = document.getElementById('fullname').value;
        const username = document.getElementById('username').value;

        const email = document.getElementById('email').value;

        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        signup(fullname, username, email, password, passwordConfirm);
    });
}

if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
}

if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const forgotBtn = document.getElementById('forgot-btn');
        forgotBtn.setAttribute('disabled', 'disabled');
        forgotBtn.innerText = 'Sending...';
        const email = document.getElementById('email').value;
        forgotpassword(email, forgotBtn);
    });
}

if (resetForm) {
    resetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        resetpassword(password, passwordConfirm);
    });
}

if (settingForm) {
    settingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullname = document.getElementById('fullname').value;
        const status = document.getElementById('status').value;
        updateMe(fullname, status);
    })
}

if (followBtn) {
    followBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const username = followBtn.id;
        if (username) {
            follow(me, username, followBtn, socket);
        }
    });
}

if (notificationBtn) {
    notificationBtn.addEventListener('click', (e) => {
        const notificationIcon = document.getElementById('notification-icon');
        if (notificationIcon.hasAttribute('style')) {
            notificationIcon.removeAttribute('style')
            const xhr = new XMLHttpRequest();
            xhr.open('PATCH', '/user/notification', true);
            xhr.send();
        }
    })
}