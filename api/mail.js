var express = require('express');
var router = require('express').Router();
var mailer = require('../misc/mailer');
var htmltemplate = 'suraj saini';


router.get('/test', function(req,res,next){
    res.send('mailsender');
     mailer.sendEmail('Contact@licIndia.com', 'subhashchandrasaini1974@gmail.com', 'reminder', htmltemplate);
     mailer.sendEmail('suraj@hi.com','suraj.saini.phe17@itbhu.ac.in','new user', htmltemplate);
     console.log('mailsended')
});

module.exports = router;