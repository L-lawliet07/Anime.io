const socket = io('/privatechat')

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')


// Options
const me = document.getElementById('me').innerText;
const friend_username = document.getElementById('friend').innerText;
const sendKey = me + '-' + friend_username;
const receiveKey = friend_username + '-' + me;

console.log('sendKey : ', sendKey);
console.log('receivedKey : ', receiveKey);

socket.on('message', (message) => {
    const html = `
                <div class="message">
                    <p>
                        <span class="message__name">${message.sender}</span>
                        <span class="message__meta">${message.createdAt}</span>
                    </p>
                    <p>${message.body}</p>
                </div>
            `;
    // const html = Mustache.render(messageTemplate, {
    //     username: message.username,
    //     message: message.text,
    //     createdAt: moment(message.createdAt).format('h:mm a')
    // })
    $messages.insertAdjacentHTML('beforeend', html);
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

    $messageFormButton.setAttribute('disabled', 'disabled')

    const body = e.target.elements.message.value;
    console.log('body : ', body);
    socket.emit('createMessage', { body, sender: me, receiver: friend_username, key: sendKey }, () => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
    });
});
socket.emit('join', { room1: sendKey, room2: receiveKey })