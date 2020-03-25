const socket = io('/privatechat')

// Elements
const $messageForm = document.querySelector('.group-message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $text_area = document.querySelector('.text-area')


// Options
const me = document.getElementById('main-username').innerText;
const friend_username = document.querySelector('.sidebar-header > .username').innerText;
const sendKey = me + '-' + friend_username;
const receiveKey = friend_username + '-' + me;

socket.on('message', (message) => {
    const html = `
        <div class="message ${message.sender === me ? "own-message" : "other-message"}">
            <img class="message-image" src="./bleach.jpg" alt="">
            <div class="message-text">
                ${message.body}
            </div>
            <div class="message-time">
                12 April
            </div>
        </div>
            `;

    $text_area.insertAdjacentHTML('beforeend', html);
});


// socket.on('roomData', (users) => {
//     let user_list = '';
//     users.forEach((el) => {
//         user_list = user_list + `<li>${el}</li>`;
//     });
//     const html = `
//                 <h2 class="room-title">${crew}</h2>
//                 <h3 class="list-title">Users</h3>
//                 <ul class="users">
//                     ${user_list}
//                 </ul>
//             `
//     document.querySelector('#sidebar').innerHTML = html
// })

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // $messageFormButton.setAttribute('disabled', 'disabled')

    const body = e.target.elements.message.value;
    socket.emit('createMessage', { body, sender: me, receiver: friend_username, key: sendKey }, () => {
        // $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
    });
});
socket.emit('join', { room1: sendKey, room2: receiveKey })