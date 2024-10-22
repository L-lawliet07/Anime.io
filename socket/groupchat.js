///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const catchAsync = require('./../utils/catchAsync');

const Users = require('./../utils/users');

///////////////////////////////////////////////////////////
// This function will provide socket functionaity for groupChat room
module.exports = (io) => {

    /*
     * using crew namespace for crew namespace
     */
    const nsp = io.of('/crew');

    /*
     * users object will contain function and data related to group chat users
     */
    const users = new Users();

    /*
     * server socket will listen for connection event
     */
    nsp.on('connection', (socket) => {

        /*
         * listening for join object
         */
        socket.on('join', (user) => {
            //joining thr room
            socket.join(user.crew);
            //adding user data in Users entry
            users.addUser(socket.id, user.username, user.crew, user.image);
            //emitting userslist event
            nsp.to(user.crew).emit('roomData', users.getUserList(user.crew));
        });

        /*
         * listening for createMessage event
         */
        socket.on('createMessage', catchAsync(async (message, callback) => {

            nsp.to(message.crew).emit('message', {
                text: message.text,
                crew: message.crew,
                username: message.username,
                image: message.image,
                createdAt: Date.now()
            });
            callback();
        }));

        /*
         * listening for user disconnect event
         */
        socket.on('disconnect', () => {
            const user = users.removeUser(socket.id);
            // Checking if user exists
            if (user) {
                nsp.to(user.crew).emit('roomData', users.getUserList(user.crew));
            }
        });
    });
}
///////////////////////////////////////////////////////////