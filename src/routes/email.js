const { response } = require('express');
let nodemailer = require('nodemailer');

exports.sendEmail = async function (reqData) {

    var transporter= nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'contactkillbacc@gmail.com',
            pass: 'shioja@1306'
        }
    })
    
    var mailOptions= {
        from: 'contactkillbacc@gmail.com',
        to: reqData.to,
        subject: reqData.subject,
        html: reqData.body
    }
    
    transporter.sendMail(mailOptions, function(error, info){
        console.log("sending")
        if(error){
            console.log(error)
            return false;
        }
        else{
            console.log('send')
            return true;
        }
    })
};