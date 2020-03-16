
const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


// Options
const username = document.getElementById('username').innerText;
const crew = document.getElementById('crewname').innerText;

socket.on('message', (message) => {
    const html = `
                <div class="message">
                    <p>
                        <span class="message__name">${message.username}</span>
                        <span class="message__meta">${message.createdAt}</span>
                    </p>
                    <p>${message.text}</p>
                </div>
            `;
    // const html = Mustache.render(messageTemplate, {
    //     username: message.username,
    //     message: message.text,
    //     createdAt: moment(message.createdAt).format('h:mm a')
    // })
    $messages.insertAdjacentHTML('beforeend', html);
});


socket.on('roomData', (users) => {
    let user_list = '';
    users.forEach((el) => {
        user_list = user_list + `<li>${el}</li>`;
    });
    const html = `
                <h2 class="room-title">${crew}</h2>
                <h3 class="list-title">Users</h3>
                <ul class="users">
                    ${user_list}
                </ul>
            `
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled')

    const text = e.target.elements.message.value;
    socket.emit('createMessage', { text, crew, username }, () => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
    });
});
socket.emit('join', { crew, username })


// export const joinCrew = (crewName) => {
//     const xhr = new XMLHttpRequest();
//     xhr.open('GET', `/crew/login/${crewName}`, true);
//     xhr.onload = function () {
//         const responseObject = JSON.parse(this.responseText);
//         if (responseObject.status === 'success') {

//             window.location.assign('/crew');
//         } else {
//             console.log('there is a error in groupChat.js');
//         }
//     }
//     xhr.send();
// };