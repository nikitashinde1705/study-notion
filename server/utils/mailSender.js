const nodemailer = require("nodemailer");

//this function is for send OTP via email
const mailSender = async (email, title, body) => {
    try{
        // let transporter = nodemailer.createTransport({
        //     host:process.env.MAIL_HOST,
        //     auth:{
        //         user: process.env.MAIL_USER,
        //         pass: process.env.MAIL_PASS,
        //     }
        // })

        let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
        });

        let info = await transporter.sendMail({
            from:'StudyNotion || CodHelp - by Nikita',
            to:`${email}`,
            subject:`${title}`,
            html:`${body},`
        })
        console.log(info);
        return info;
    }

    catch(error){
        console.error("MAIL ERROR:", error);
        throw error; // IMPORTANT
        //console.log(error.message);
    }
}

module.exports = mailSender;