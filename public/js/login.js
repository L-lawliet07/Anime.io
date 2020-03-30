///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

import { showAlert } from './alerts.js'

///////////////////////////////////////////////////////////
// login function will make xhr post request to the server
export const login = (email, password) => {
    const $login_btn = document.getElementById('login-btn');
    $login_btn.innerText = 'Logging in..';
    $login_btn.setAttribute('disabled', 'disabled');

    const xhr = new XMLHttpRequest();

    xhr.open('POST', '/user/login', true);

    xhr.onload = function () {
        $login_btn.innerText = 'Log In';
        $login_btn.removeAttribute('disabled');
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
///////////////////////////////////////////////////////////
