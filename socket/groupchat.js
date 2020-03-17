///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const CrewMessage = require('./../models/crewMessage');

const catchAsync = require('./../utils/catchAsync');

const Users = require('./../utils/users');

///////////////////////////////////////////////////////////
// This function will provide socket functionaity for server
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
            console.log(`${user.username} joined to ${user.crew}`);
            //adding user data in Users entry
            users.addUser(socket.id, user.username, user.crew);
            //emitting userslist event
            nsp.to(user.crew).emit('roomData', users.getUserList(user.crew));
        });

        /*
         * listening for createMessage event
         */
        socket.on('createMessage', catchAsync(async (message, callback) => {

            const groupMessage = await CrewMessage.create({
                sender: message.username,
                crew: message.crew,
                body: message.text
            });
            nsp.to(message.crew).emit('message', {
                text: groupMessage.body,
                crew: groupMessage.crew,
                username: groupMessage.sender,
                createdAt: groupMessage.createdAt.toString()
            });
            callback()
        }));

        /*
         * listening for user disconnect event
         */
        socket.on('disconnect', () => {
            const user = users.removeUser(socket.id);

            if (user) {
                nsp.to(user.crew).emit('roomData', users.getUserList(user.crew));
                console.log(`${user.username} left ${user.crew} group`);
            }
        });
    });
}
///////////////////////////////////////////////////////////