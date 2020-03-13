import { showAlert } from './alerts.js'

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