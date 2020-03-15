///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// This function will provide socket functionaity for server
module.exports = (io, Users) => {

    /*
     * users object will contain function and data related to group chat users
     */
    const users = new Users();

    /*
     * server socket will listen for connection event
     */
    io.on('connection', (socket) => {

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
            io.to(user.crew).emit('roomData', users.getUserList(user.crew));
        });

        /*
         * listening for createMessage event
         */
        socket.on('createMessage', (message, callback) => {

            io.to(message.crew).emit('message', {
                text: message.text,
                crew: message.crew,
                username: message.username
            });
            callback()
        });

        /*
         * listening for user disconnect event
         */
        socket.on('disconnect', () => {
            const user = users.removeUser(socket.id);

            if (user) {
                io.to(user.crew).emit('roomData', users.getUserList(user.crew));
                console.log(`${user.username} left ${user.crew} group`);
            }
        })
    });
}
///////////////////////////////////////////////////////////