
const socket = io('/crew')

// Elements
const $messageForm = document.querySelector('.group-message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
// const $sendLocationButton = document.querySelector('#send-location')
const $text_area = document.querySelector('.text-area')
$text_area.scrollTop = $text_area.scrollHeight;

// Options
const username = document.getElementById('main-username').innerText;
const crew = document.querySelector('.group-name').innerText;

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

    const html = `
        <div class="message ${message.username === username ? "own-message" : "other-message"}">
            <img class="message-image" src="./bleach.jpg" alt="">
            <div class="message-text">
            ${message.text}
            </div>
            <div class="message-time">
                12 April
            </div>
        </div>
    `
    // const html = Mustache.render(messageTemplate, {
    //     username: message.username,
    //     message: message.text,
    //     createdAt: moment(message.createdAt).format('h:mm a')
    // })
    $text_area.insertAdjacentHTML('beforeend', html);
    autoScroll();
});


socket.on('roomData', (users) => {
    let html = '';
    users.forEach((el) => {

        html = html + `
        <div class="online-user">
        <img src="./one piece.jpg" alt="">
        <div class="online-username">
            ${el}
        </div>
        </div>
        `;
    });
    document.querySelector('.online-users').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // $messageFormButton.setAttribute('disabled', 'disabled')

    const text = e.target.elements.message.value;
    socket.emit('createMessage', { text, crew, username }, () => {
        // $messageFormButton.removeAttribute('disabled')
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