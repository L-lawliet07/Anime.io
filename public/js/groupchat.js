///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

export const groupChat = (io) => {

    const socket = io('/crew')

    ///////////////////////////////////////////////////////////
    // elements
    const $messageForm = document.querySelector('.group-message-form');
    const $messageFormInput = $messageForm.querySelector('input');
    const $text_area = document.querySelector('.text-area');
    const $attack = document.querySelector('.attack');
    const $defence = document.querySelector('.defence');
    ///////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////
    // Initially pointing to the last message 
    $text_area.scrollTop = $text_area.scrollHeight;
    ///////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////
    // information about the user and crew
    const username = document.getElementById('main-username').innerText;
    const crew = document.querySelector('.group-name').innerText;
    const image = document.getElementById('main-image').src;
    ///////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////
    // This function will autoscroll whenever there is a new message
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
    ///////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////
    // message event will listen for new messages 
    socket.on('message', (message) => {

        const date = new Date(message.createdAt);

        let content = '';
        if (message.text === '<{*attack*}>') {
            content = '<img style="max-width:100%" src="/images/gif/attack.gif" alt="">';
        } else if (message.text === '<{*defence*}>') {
            content = '<img style="max-width:100%" src="/images/gif/defence.gif" alt="">';
        } else {
            content = message.text;
        }
        const html = `
            <div class="message ${message.username === username ? "own-message" : "other-message"}">
                <img class="message-image" src=${message.image} alt="">
                <div class="message-text">
                ${content}
                </div>
                <div class="message-time">
                    ${date.toDateString()} / ${date.getHours()}:${date.getMinutes()}
                </div>
            </div>
        `
        // inserting new message at the end
        $text_area.insertAdjacentHTML('beforeend', html);

        // Scrolling after inserting each message
        autoScroll();
    });
    ///////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////
    // roomDate eventListner will accept roomList that contain currently active users
    socket.on('roomData', (users) => {

        let html = '';

        users.forEach((el) => {

            html = html + `
            <div class="online-user">
            <img src=${el.image} alt="">
            <div class="online-username">
            <a href="/user/profile/${el.username}" target="_blank">${el.username}</a>
            </div>
            </div>
            `;
        });
        // Inserting the html
        document.querySelector('.online-users').innerHTML = html
        // updating the user count
        document.querySelector('.usercount').innerText = users.length;
    });
    ///////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////
    // sendMessage function will make a xhr request to save the message to the db
    const sendMessage = (text, crew) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/crew/chat/message', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ text, crew }));
    }
    ///////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////
    // listening for submit event to send message
    $messageForm.addEventListener('submit', (e) => {

        e.preventDefault();

        // text contain the message user want to send
        const text = e.target.elements.message.value;

        // emitting createMessage event to send message to the server
        socket.emit('createMessage', { text, crew, username, image }, () => {
            $messageFormInput.value = '';
            $messageFormInput.focus()
            sendMessage(text, crew);
        });
    });
    ///////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////
    // listening for attack click event
    $attack.addEventListener('click', (e) => {
        const text = "<{*attack*}>";
        $attack.setAttribute('disabled', 'disabled');
        $attack.innerHTML = '<i class="far fa-circle"></i>';
        socket.emit('createMessage', { text, crew, username, image }, () => {
            $attack.innerHTML = '<i class="fas fa-bomb"></i>';
            $attack.removeAttribute('disabled');
        });
        sendMessage(text, crew);

    });
    ///////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////
    // listening for defence click event
    $defence.addEventListener('click', (e) => {
        const text = "<{*defence*}>";
        $defence.setAttribute('disabled', 'disabled');
        socket.emit('createMessage', { text, crew, username, image }, () => {
            $defence.innerHTML = '<i class="fas fa-shield-alt"></i>';
            $defence.removeAttribute('disabled');
        });
        sendMessage(text, crew);
    });
    ///////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////
    // emitting join event so that user can connect to particular room/crew
    socket.emit('join', { crew, username, image });
    ///////////////////////////////////////////////////////////
}
