const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({

    email: {
        type:String,
        required:true,
    },
    otp: {
        type:String,
        required:true,
    },
    createdAt: {
        type:Date,
        default:Date.now(),
        expires:5*60, /// The document will be automatically deleted after 5 minutes of its creation time
	},

});

// a function -> to send emails
async function sendVerificationEmail(email, otp) {
    try{
        const mailResponse = await mailSender(
            email, 
            "Verification Email from StudyNotion", 
            emailTemplate(otp)
        );
        console.log("Email sent successfully: ", mailResponse.response);
    }
    catch(error){
        console.log("Error occured while sending the mails: ",error);
        throw error;
    }
}

//pre middleware - before the document save in DB otp verification done
OTPSchema.pre("save", async function name() {
    console.log("New document saved to database");

    // Only send an email when a new document is created
    if (this.isNew){
        await sendVerificationEmail(this.email, this.otp);
    }
   // next();
});

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;