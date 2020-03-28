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


socket.on('following-notification', (user) => {
    const notificationIcon = document.getElementById('notification-icon');
    const notificationContainer = document.getElementById('notification-container');
    notificationIcon.setAttribute('style', 'color: red;');
    const noNotification = document.querySelector('.no-notification');
    if (noNotification) {
        noNotification.setAttribute('style', 'display:none;');
    }
    const html = `<a class="dropdown-item" href="/user/profile/${user}">${user} started following you.</a>`;
    notificationContainer.insertAdjacentHTML('afterbegin', html)
});

socket.on('unseenmessage-notification', (user) => {
    const notificationIcon = document.getElementById('notification-icon');
    const notificationContainer = document.getElementById('notification-container');
    notificationIcon.setAttribute('style', 'color: red;');
    const noNotification = document.querySelector('.no-notification');
    if (noNotification) {
        noNotification.setAttribute('style', 'display:none;');
    }
    const html = `<a class="dropdown-item" href="/user/profile/${user}">${user} started following you.</a>`;
    notificationContainer.insertAdjacentHTML('afterbegin', html)
});

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const logoutButton = document.getElementById('logout-btn');
const forgotForm = document.getElementById('forgot-form');
const resetForm = document.getElementById('reset-form');
const settingForm = document.querySelector('.setting-form');
const followBtn = document.querySelector('.follow-btn');
const notificationBtn = document.querySelector('.notification-btn');
const unseenmessageBtn = document.querySelector('.unseenmessage-btn');

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

        const form = new FormData();
        form.append('fullname', document.getElementById('fullname').value);
        form.append('status', document.getElementById('status').value);
        form.append('photo', document.getElementById('photo').files[0]);
        updateMe(form);
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
            xhr.open('PATCH', '/user/clearnotification', true);
            xhr.send();
        }
    })
}

if (unseenmessageBtn) {
    unseenmessageBtn.addEventListener('click', (e) => {
        const unseenmessageIcon = document.getElementById('unseenmessage-icon');
        if (unseenmessageIcon.hasAttribute('style')) {
            unseenmessageIcon.removeAttribute('style');
            const xhr = new XMLHttpRequest();
            xhr.open('PATCH', '/user/clearunseeenmessage', true);
            xhr.send();
        }
    });
}