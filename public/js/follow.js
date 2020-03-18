import { showAlert } from './alerts.js'

export const follow = (username, followBtn) => {

    followBtn.setAttribute('disabled', 'disabled');
    followBtn.innerText = 'Following';
    const xhr = new XMLHttpRequest();
    xhr.open('PATCH', `/user/follow`, true);
    xhr.onload = function () {
        const responseObject = JSON.parse(this.responseText);
        if (responseObject.status === 'success') {
            followBtn.innerText = 'Followed';
        } else {
            followBtn.innerText = username;
            followBtn.removeAttribute('disabled');
            showAlert('error', responseObject.message, 2);
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ username }));
}