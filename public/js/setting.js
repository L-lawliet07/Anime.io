///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

import { showAlert } from './alerts.js'

///////////////////////////////////////////////////////////
// Update me function will make a path request to update the user data
export const updateMe = (data) => {

    const xhr = new XMLHttpRequest();
    xhr.open('PATCH', '/user/setting', true);

    xhr.onload = function () {
        const responseObject = JSON.parse(this.responseText);
        if (responseObject.status === 'success') {
            location.reload(true);
        } else {
            showAlert('error', responseObject.message, 2);
        }
    }
    xhr.send(data);
}
///////////////////////////////////////////////////////////

