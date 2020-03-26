///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const Message = require('./../models/message');

const catchAsync = require('./../utils/catchAsync');

///////////////////////////////////////////////////////////
// This function will provide socket functionaity for server
module.exports = (io) => {


    /*
     * using crew namespace for crew namespace
     */
    const nsp = io.of('/privatechat');

    /*
     * server socket will listen for connection event
     */
    nsp.on('connection', (socket) => {

        /*
         * listening for join object
         */
        socket.on('join', (pr) => {
            //joining thr room
            socket.join(pr.room1);
            socket.join(pr.room2);
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
            callback()
        }));

        /*
         * listening for user disconnect event
         */
        // socket.on('disconnect', () => {
        //     const user = users.removeUser(socket.id);

        //     if (user) {
        //         nsp.to(user.crew).emit('roomData', users.getUserList(user.crew));
        //         console.log(`${user.username} left ${user.crew} group`);
        //     }
        // });
    });
}
///////////////////////////////////////////////////////////