router = require('express').Router();
var async = require('async');
var User = require('../models/user');
var Doctor = require('../models/doctor');

router.get("/", function(req,res,next){
    res.send('working<a href="/ajax/api/filter">/ajax/api/filter</a><br><a href="/ajax/api/x">/ajax/api/x</a><br>')
});


router.get("/filter", function(req,res,next){
    Doctor.find({}, function(err, doctor){
        if(err) return next (err);
        res.render("ajax", {title: 'sort by test'})
    });
});
router.post("/filter", function(req,res,next){
    Doctor.find({}).populate('category').exec(
        function(err, doctor){
            if(err) return next (err);
            res.json(doctor);
            // console.log(doctor)
        }
    );
});
router.get('/test', function(req,res,next){
    User.find({}, function(err, data){
        if(err) next(err);
        res.send(data)
    })
})
module.exports = router;