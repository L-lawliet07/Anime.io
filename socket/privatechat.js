///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const Message = require('./../models/message');

const catchAsync = require('./../utils/catchAsync');

const Users = require('./../utils/users');

///////////////////////////////////////////////////////////
// This function will provide socket functionaity for server
module.exports = (io) => {


    /*
     * using crew namespace for crew namespace
     */
    const nsp = io.of('/privatechat');


    /*
     * users object will contain function and data related to  chat users
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
            //joining the room
            socket.join(pr.sendKey);
            socket.join(pr.receiveKey);
            // Adding new user to the users list
            users.addUser(socket.id, pr.username, pr.sendKey, pr.image);
            const friend = users.getUserList(pr.receiveKey);
            // If friend exist than only both are online
            if (friend.length > 0) {
                nsp.to(pr.sendKey).emit('roomData', "online");
            }
        });

        /*
         * listening for createMessage event
         */
        socket.on('createMessage', catchAsync(async (message, callback) => {

            nsp.to(message.key).emit('message', {
                body: message.body,
                sender: message.sender,
                receiver: message.receiver,
                createdAt: Date.now(),
                image: message.image
            });
            callback();
        }));

        /*
         * listening for user disconnect event
         */
        socket.on('disconnect', () => {

            const user = users.removeUser(socket.id);
            if (user) {
                nsp.to(user.crew).emit('roomData', "offline");
            }
        });
    });
}
///////////////////////////////////////////////////////////