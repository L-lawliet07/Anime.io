/////////////////////////////////////
// @author : Mandeep Bisht
/////////////////////////////////////

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DB.replace(
    '<PASSWORD>',
    process.env.DB_PASSWORD
);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(connection => {
    console.log('DB connection is successfull');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});