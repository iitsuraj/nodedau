var nodemailer = require('nodemailer');
var config = require('../config/mail');

var transport = nodemailer.createTransport({
    service: config.service,
    auth: {
        user: config.mailUserName,
        pass: config.mailPassword,
    },
    tls:{
        rejectUnauthorized: false
    }
});

module.exports ={
    sendEmail(from, to, subject, html){
        return new Promise(function(resolve, reject){
            transport.sendMail({from, subject, to, html},function(err,info){
                if(err) reject(err);

                resolve(info);
            });
        });
    }
}