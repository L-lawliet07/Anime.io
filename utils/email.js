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
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "67f218add4ce57",
            pass: "de22b79ce59823"
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