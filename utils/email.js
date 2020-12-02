///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////

const nodemailer = require('nodemailer');

///////////////////////////////////////////////////////////
// send email 
const sendEmail = async (options) => {

    /*
     * create a transporter
     */
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    /*
     * define emal options
     */
    const mailOptions = {
        from: 'Anime.io <Animeio@Anime.io>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    /*
     * Actually send email
     */
    await transport.sendMail(mailOptions);
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// exposing sendmail function
module.exports = sendEmail
///////////////////////////////////////////////////////////