///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

import { showAlert } from './alerts.js'

///////////////////////////////////////////////////////////
// forgotpassword function will send reset email the server
export const forgotpassword = (email, $forgotBtn) => {

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/user/forgotPassword', true);

    xhr.onload = function () {
        $forgotBtn.removeAttribute('disabled');
        $forgotBtn.innerText = 'Send Token';
        const responseObject = JSON.parse(this.responseText);
        showAlert(responseObject.status, responseObject.message, 2);
    }
    // setting up content type
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ email }));
}
///////////////////////////////////////////////////////////