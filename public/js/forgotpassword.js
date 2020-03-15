import { showAlert } from './alerts.js'

export const forgotpassword = (email, forgotBtn) => {
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
}