const socket = io('/privatechat')

// Elements
const $messageForm = document.querySelector('.group-message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $text_area = document.querySelector('.text-area')
$text_area.scrollTop = $text_area.scrollHeight;


// Options
const me = document.getElementById('main-username').innerText;
const friend_username = document.querySelector('.sidebar-header > .username').innerText;
const sendKey = me + '-' + friend_username;
const receiveKey = friend_username + '-' + me;
const image = document.getElementById('main-image').src;

const autoScroll = () => {
    //  new message element 
    const $newMessage = $text_area.lastElementChild
    // height of lastMessage
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginTop) + parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // visibleHeight
    const visibleHeight = $text_area.offsetHeight;
    // Height of messages container
    const containerHeight = $text_area.scrollHeight;

    // How far have I scrolled;
    const scrollOffset = $text_area.scrollTop + visibleHeight
    if (containerHeight - 2 * newMessageHeight <= scrollOffset) {
        $text_area.scrollTop = $text_area.scrollHeight;
    }
}

socket.on('message', (message) => {
    const date = new Date(message.createdAt);
    const html = `
        <div class="message ${message.sender === me ? "own-message" : "other-message"}">
            <img class="message-image" src=${message.image} alt="">
            <div class="message-text">
                ${message.body}
            </div>
            <div class="message-time">
            ${date.toDateString()} / ${date.getHours()}:${date.getMinutes()}

            </div>
        </div>`;

    $text_area.insertAdjacentHTML('beforeend', html);
    autoScroll();
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

const sendMessage = (text, receiver) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/user/chat/message', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ text, receiver }));
}

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const body = e.target.elements.message.value;
    socket.emit('createMessage', {
        body,
        sender: me,
        receiver: friend_username,
        key: sendKey,
        image
    }, () => {
        $messageFormInput.value = ''
        $messageFormInput.focus()
        sendMessage(body, friend_username);
    });
});
socket.emit('join', { room1: sendKey, room2: receiveKey })