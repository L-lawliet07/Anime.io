import { showAlert } from './alerts.js'

export const logout = () => {
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
}