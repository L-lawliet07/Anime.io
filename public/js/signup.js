///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

import { showAlert } from './alerts.js'

///////////////////////////////////////////////////////////
// signup function will make a post request to the server to create a new user 
export const signup = (fullname, username, email, password, passwordConfirm) => {
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
///////////////////////////////////////////////////////////