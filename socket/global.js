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
         * listening for following event for notification
         */
        socket.on('following', catchAsync(async (message, callback) => {

            const notification = `${message.username} started following you`;
            nsp.to(message.room).emit('following-notification', notification);
            callback()
        }));

        /*
         * listening for unseen message event for notification
         */
        // socket.on('unseen', catchAsync(async (message, callback) => {

        //     const notification = `${message.username} started following you`;
        //     nsp.to(message.room).emit('following-notification', notification);
        //     callback()
        // }));

    });
}
///////////////////////////////////////////////////////////