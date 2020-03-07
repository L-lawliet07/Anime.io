/////////////////////////////////////
// @author : Mandeep Bisht
/////////////////////////////////////
const app = require('./app');

const port = 3000;

app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});