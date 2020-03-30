///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

import { showAlert } from './alerts.js'

///////////////////////////////////////////////////////////
// logout function will logout the user 
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
///////////////////////////////////////////////////////////