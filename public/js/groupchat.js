
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
const image = document.getElementById('main-image').src;

// This function will do auto scrolling work
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
        <div class="message ${message.username === username ? "own-message" : "other-message"}">
            <img class="message-image" src=${message.image} alt="">
            <div class="message-text">
            ${message.text}
            </div>
            <div class="message-time">
                ${date.toDateString()} / ${date.getHours()}:${date.getMinutes()}
            </div>
        </div>
    `
    $text_area.insertAdjacentHTML('beforeend', html);
    autoScroll();
});


socket.on('roomData', (users) => {
    let html = '';
    users.forEach((el) => {

        html = html + `
        <div class="online-user">
        <img src=${el.image} alt="">
        <div class="online-username">
            ${el.username}
        </div>
        </div>
        `;
    });
    document.querySelector('.online-users').innerHTML = html
    document.querySelector('.usercount').innerText = users.length;
});


const sendMessage = (text, crew) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/crew/chat/message', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ text, crew }));
}

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // $messageFormButton.setAttribute('disabled', 'disabled')

    const text = e.target.elements.message.value;
    socket.emit('createMessage', { text, crew, username, image }, () => {
        // $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = '';
        $messageFormInput.focus()
        sendMessage(text, crew);
    });
});

socket.emit('join', { crew, username, image });