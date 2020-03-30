///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const Users = require('./../utils/users');

///////////////////////////////////////////////////////////
// This function will provide private chat socket functionaity for server
module.exports = (io) => {

    /*
     * using private namespace for private chat
     */
    const nsp = io.of('/privatechat');

    /*
     * users object will contain function and data related to online users
     */
    const users = new Users();

    /*
     * server socket will listen for connection event
     */
    nsp.on('connection', (socket) => {

        /*
         * listening for join object
         */
        socket.on('join', (pr) => {

            //joining the rooms  
            socket.join(pr.sendKey);
            socket.join(pr.receiveKey);

            // Adding new user to the users list
            users.addUser(socket.id, pr.username, pr.sendKey, pr.image);

            // Checking if the other person is online or not
            const friend = users.getUserList(pr.receiveKey);

            // if friend exists that means both are online 
            if (friend.length > 0) {
                // sending online status to the users
                nsp.to(pr.sendKey).emit('roomData', "online");
            }
        });

        /*
         * listening for createMessage event
         */
        socket.on('createMessage', (message, callback) => {


            // emitting message event 
            if (message.body) {
                nsp.to(message.key).emit('message', {
                    body: message.body,
                    sender: message.sender,
                    receiver: message.receiver,
                    createdAt: Date.now(),
                    image: message.image
                });
                callback();
            }
        });


        /*
         * listening for createMessage event
         */
        socket.on('typing', (data) => {
            socket.broadcast.to(data.room).emit('userTyping', data.receiver);
        });

        /*
         * listening for user disconnect event
         */
        socket.on('disconnect', () => {

            // removing disconnected user from online user group
            const user = users.removeUser(socket.id);
            if (user) {
                // sending offline status to the users
                nsp.to(user.crew).emit('roomData', "offline");
            }
        });
    });
}
///////////////////////////////////////////////////////////