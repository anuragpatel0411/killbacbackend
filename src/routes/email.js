const { response } = require('express');
let nodemailer = require('nodemailer');

exports.sendEmail = async function (reqData) {

    var transporter= nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'patelanurag.0411@gmail.com',
            pass: 'Anur@g0411'
        }
    })
    
    var mailOptions= {
        from: 'patelanurag.0411@gmail.com',
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