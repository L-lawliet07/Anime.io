import { showAlert } from './alerts.js'


export const updateMe = (data) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PATCH', '/user/setting', true);
    xhr.onload = function () {
        const responseObject = JSON.parse(this.responseText);
        if (responseObject.status === 'success') {
            showAlert('success', 'Updated', 2);
        } else {
            showAlert('error', responseObject.message, 2);
        }
    }
    xhr.send(data);
}