///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

import { showAlert } from './alerts.js'

///////////////////////////////////////////////////////////
// resetPassword function will make a patch request to the server to reset password
export const resetpassword = (password, passwordConfirm) => {
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
}
///////////////////////////////////////////////////////////