///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

import { showAlert } from './alerts.js'

///////////////////////////////////////////////////////////
// follow function will be called to send follow request
export const follow = (me, person, $followBtn, socket) => {

    $followBtn.innerText = 'Following';
    // instantiating xhr object
    const xhr = new XMLHttpRequest();

    xhr.open('PATCH', `/user/follow`, true);

    xhr.onload = function () {

        const responseObject = JSON.parse(this.responseText);

        if (responseObject.status === 'success') {
            socket.emit('following', { room: person, username: me }, () => {
                // here we will do some kind of confirmation
            });
            $followBtn.innerText = 'Followed';
        } else {
            $followBtn.innerText = 'Follow';
            showAlert('error', responseObject.message, 2);
        }
    }
    // setting content type
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ username: person }));
}
///////////////////////////////////////////////////////////