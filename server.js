/////////////////////////////////////
// @author : Mandeep Bisht
/////////////////////////////////////
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});