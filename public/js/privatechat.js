///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////


export const privateChat = (io, global) => {


    ///////////////////////////////////////////////////////////
    // socket object for private chat
    const socket = io('/privatechat')
    ///////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////
    // elements
    const $messageForm = document.querySelector('.group-message-form');
    const $messageFormInput = $messageForm.querySelector('input');
    const $text_area = document.querySelector('.text-area');
    const $messageBox = document.getElementById('private-typingbox');
    const $indicator = document.querySelector('.sidebar-header > img');
    const $online_status = document.querySelector('.sidebar-header>.online-status');
    ///////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////
    // Initially pointing to the last message 
    $text_area.scrollTop = $text_area.scrollHeight;
    ///////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////
    // information about the user, friend and room
    const me = document.getElementById('main-username').innerText;
    const friend_username = document.querySelector('.sidebar-header > .username').innerText;
    const sendKey = me + '-' + friend_username;
    const receiveKey = friend_username + '-' + me;
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

        // inserting new message at the end
        $text_area.insertAdjacentHTML('beforeend', html);

        // Scrolling after inserting each message
        autoScroll();
    });
    ///////////////////////////////////////////////////////////


    let offline = true;
    ///////////////////////////////////////////////////////////
    // roomDate eventListner will accept the status of other user
    socket.on('roomData', (status) => {
        if (status === 'online') {
            offline = false;
            $indicator.setAttribute('style', 'border : #37a08e 2px solid;');
            $online_status.innerText = 'online';
            $online_status.setAttribute('style', 'color : #37a08e;');
        } else {
            offline = true;
            $indicator.removeAttribute('style');
            $online_status.innerText = 'offline';
            $online_status.removeAttribute('style');
        }
    });
    ///////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////
    // Function to send offline user notification about message
    const sendMessageNotification = (receiver) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PATCH', '/user/chat/message/notification');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            const responseObject = JSON.parse(this.responseText);
            if (responseObject.status === 'success') {
                global.emit('unseen', { room: friend_username, username: me }, () => {
                    // here we will do some acnowledgement
                });
            };
        }
        xhr.send(JSON.stringify({ receiver }));
    }
    ///////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////
    // sendMessage function will make a xhr request to save the message to the db
    const sendMessage = (text, receiver) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/user/chat/message', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ text, receiver }));
    }
    ///////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////
    // listening for submit event to send message
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
            $messageFormInput.value = '';
            $messageFormInput.focus();
            sendMessage(body, friend_username);
            // What we can also do is just to send one post request for message and update both things
            if (offline) {
                sendMessageNotification(friend_username);
            }
        });

    });
    ///////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////
    // listening for keypress event to emit typing event
    $messageBox.addEventListener('keypress', () => {
        socket.emit('typing', { receiver: friend_username, room: sendKey });
    });
    ///////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////
    // listening for userTyping event 
    let typing = false;
    socket.on('userTyping', (user) => {
        if (user === me && !typing) {
            const style_attr = $indicator.getAttribute('style');
            $indicator.setAttribute('style', 'border : #479adf 4px solid; transition-property:none;');
            typing = true;
            setTimeout(() => {
                $indicator.setAttribute('style', style_attr);
                typing = false;
            }, 100);
        }
    });
    ///////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////
    // emitting join event so that user can connect to particular room/crew
    socket.emit('join', { username: me, image, sendKey, receiveKey });
    ///////////////////////////////////////////////////////////
}



