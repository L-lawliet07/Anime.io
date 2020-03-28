///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const catchAsync = require('./../utils/catchAsync');

///////////////////////////////////////////////////////////
// This function will provide socket functionaity for server
module.exports = (io) => {

    /*
     * using default namespace for global use
     */
    const nsp = io.of('/');

    /*
     * server socket will listen for connection event
     */
    nsp.on('connection', (socket) => {

        /*
         * listening for join event on connected socket
         */
        socket.on('join', (room) => {
            // joining the room ( roomid is basically the username )
            socket.join(room);
        });

        /*
         * listening for following event for notification
         */
        socket.on('following', catchAsync(async (message, callback) => {

            // emitting following notification to followed person
            nsp.to(message.room).emit('following-notification', message.username);
            callback()
        }));

        /*
         * listening for unseen message event for notification
         */
        socket.on('unseen', catchAsync(async (message, callback) => {
            // emitting unseenmessage notification to the receiver
            nsp.to(message.room).emit('unseenmessage-notification', message.username);
            callback()
        }));

    });
}
///////////////////////////////////////////////////////////