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
         * listening for join object
         */
        socket.on('join', (room) => {
            socket.join(room);
        });

        /*
         * listening for createMessage event
         */
        socket.on('following', catchAsync(async (message, callback) => {

            const notification = `${message.username} started following you`;
            console.log(notification);
            console.log(message);
            nsp.to(message.room).emit('following-notification', notification);
            callback()
        }));
    });
}
///////////////////////////////////////////////////////////