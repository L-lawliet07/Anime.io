const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg, time = 6) => {
    hideAlert();
    const markup = `<div class="alert alert-${type === 'success' ? 'success' : 'error'}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, time * 1000);
};

const login = (email, password) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/user/login', true);
    xhr.onload = function () {
        const responseObject = JSON.parse(this.responseText);
        if (responseObject.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
                window.location.assign('/crew');
            }, 1500);
        } else {
            showAlert('error', responseObject.message, 2);
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ email, password }));
}


const signup = (fullname, username, email, password, passwordConfirm) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/user/signup', true);
    xhr.onload = function () {
        const responseObject = JSON.parse(this.responseText);
        if (responseObject.status === 'success') {
            showAlert('success', 'Account Created');
            window.setTimeout(() => {
                window.location.assign('/crew');
            }, 1500);
        } else {
            showAlert('error', responseObject.message, 2);
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ fullname, username, email, password, passwordConfirm }));
}

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const logoutButton = document.getElementById('logout-btn');
const forgotForm = document.getElementById('forgot-form');
const resetForm = document.getElementById('reset-form');


if (loginForm)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });


if (signupForm)
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('inside');
        const fullname = document.getElementById('fullname').value;
        const username = document.getElementById('username').value;

        const email = document.getElementById('email').value;

        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        signup(fullname, username, email, password, passwordConfirm);
    });

if (logoutButton)
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/user/logout', true);
        xhr.onload = function () {
            const responseObject = JSON.parse(this.responseText);
            if (responseObject.status === 'success') {
                window.location.assign('/');
            } else {
                showAlert('error', responseObject.message, 2);
            }
        }
        xhr.send();
    })

if (forgotForm)
    forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const forgotBtn = document.getElementById('forgot-btn');
        forgotBtn.setAttribute('disabled', 'disabled');
        forgotBtn.innerText = 'Sending...';
        const email = document.getElementById('email').value;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/user/forgotPassword', true);
        xhr.onload = function () {
            forgotBtn.removeAttribute('disabled');
            forgotBtn.innerText = 'Send Token';
            const responseObject = JSON.parse(this.responseText);
            showAlert(responseObject.status, responseObject.message, 2);
        }
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ email }));
    });

if (resetForm)
    resetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        const xhr = new XMLHttpRequest();
        xhr.open('PATCH', '/user/resetpassword', true);
        xhr.onload = function () {
            const responseObject = JSON.parse(this.responseText);
            if (responseObject.status === 'success') {
                showAlert('success', 'Password Changed');
                window.setTimeout(() => {
                    window.location.assign('/crew');
                }, 1500);
            } else {
                showAlert('error', responseObject.message, 2);
            }
        }
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ password, passwordConfirm }));
    });