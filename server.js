///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const mongoose = require('mongoose');

const dotenv = require('dotenv');

const http = require('http');

const Users = require('./utils/users');

///////////////////////////////////////////////////////////
// handling uncaughtException
// process.on('uncaughtException', err => {
//     console.error(`[${err.name}] : ${err.message}`);
//     server.close(() => {
//         process.exit(1);
//     });
// });
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Attaching configuration file to current environment
dotenv.config({ path: './config.env' });
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Importing express app
const app = require('./app');
///////////////////////////////////////////////////////////

const server = http.createServer(app);
const io = require('socket.io')(server);

///////////////////////////////////////////////////////////
// Establishing a mongodb connection
const DB = process.env.DB.replace(
    '<PASSWORD>',
    process.env.DB_PASSWORD
);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(connection => console.log('[Anime.io] : DB connection is successfull'));
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Listening on specified port
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`[Anime.io] : Application is running on port ${port}`);
});
///////////////////////////////////////////////////////////

require('./socket/groupchat')(io, Users);

///////////////////////////////////////////////////////////
// handling unhandledRejection
process.on('unhandledRejection', err => {
    console.error(`[${err.name}] : ${err.message}`);

    server.close(() => {
        process.exit(1);
    });
});
///////////////////////////////////////////////////////////