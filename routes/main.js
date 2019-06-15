var router = require('express').Router();
var Doctor = require('../models/doctor');
var User = require('../models/user');
var async = require("async");
var passportConf = require('../config/passport');
var mongoose = require('mongoose');
var Category = require('../models/category');



router.post('/search', function(req,res,next){
    Category.find({ "name": { "$regex": req.body.search_term, "$options": "i" } }, function(err, data){
        if (err) return next(err);
        res.send(data);
        // console.log(data);
    });
    console.log(req.body)
});

router.get('/search', function(req,res,next){
    res.render('main/search', {title: 'search'})
});



router.get('/category', function(req,res,next){
    res.render('main/category', { title: 'home', userType : 'doctor' });
});


// router.get('/doctors/:id',passportConf.isAuthenticated, function(req,res,next){
//     Doctor.find({category:req.params.id})
//     .populate("category")
//     .exec(function(err, doctors){
//         if (err) return next (err);
//         res.render('main/doctors', {doctors: doctors, title:'doctors'})
//     })
// });
router.get('/doctors/:id',passportConf.isAuthenticated, function(req,res,next){
    Doctor.find({category:req.params.id})
    .populate("category")
    .exec(function(err, doctors){
        if (err) return next (err);
        res.render('main/list', {doctors: doctors, title:'doctors'});
    })
});
// router.post('/doctors/:id',passportConf.isAuthenticated, function(req,res,next){
//     var today = new Date();
//     Doctor.findById({_id:req.body.doctor_id},function(err, doctor){
//         if(err) next (err);
//         doctor.booking.push({
//             patient: req.user._id,
//             date: today
//         });
//         doctor.save(function(err){
//             if(err) return (err);
//             return res.json("booked")
//         });
//     });
// });
    
    router.post("/doctor/:id", function(req, res, next) {
        var today =new Date;
        var valid = mongoose.Types.ObjectId.isValid(req.params.id);
        var userPrototype = Object.getPrototypeOf(req.user);

        if (valid) {
            if (userPrototype === User.prototype){
                async.waterfall([
                    function(callback){
                      Doctor.findById({_id: req.params.id}, function(err, doctor){
                          if(err) next(err);
                          doctor.booking.push({
                              date: today,
                              visitdate: req.body.calendar,
                              slote:req.body.radio_time,
                              patient: req.user._id
                          });
                          doctor.save(function(err, doctor){
                              if(err) return next(err);
                              callback(null, doctor);
                          });
          
                      });
                    },
                    function(doctor){
                      User.findById({_id: req.user._id}, function(err, user){
                          user.booking.push({
                              date: today,
                              visitdate: req.body.calendar,
                              slote:req.body.radio_time,
                              doctor: doctor._id
                          });
                          user.save(function(err,user){
                              if(err) return next(err);
                              res.send(user);
                          });
                      });
                    }
                  ]);
            } else if(userPrototype === Doctor.prototype){
                res.send('please use your user id')
            }
        } else {
            res.send('please use a valid id')
        }

      });

router.get('/doctor/:id', passportConf.isAuthenticated,function(req,res,next){
    var valid = mongoose.Types.ObjectId.isValid(req.params.id);
    if (valid) {
        Doctor.findById({_id: req.params.id}).populate('category').exec(
            function(err, doctor){
                if (err) return next(err);
                if (doctor === null){
                    res.send('404')
                } else {
                    res.render('main/doctor', {
                            doctor: doctor, title: 'doctor'
                        })
                }               
            }
        ) 
    } else {
        res.send('404')
    }
    
});
router.get('/set', function(req,res,next){
    Doctor.findById({_id: '5cff4cd83cd0c33c0c979097'}, function(err,doctor){
        if(err) return next(err);
        doctor.address.geolocation.type = 'Point',
        doctor.address.geolocation.coordinates.push( 28.693709, 75.148662);
        doctor.save(function(err, doctor){
            if(err) next (err);
            res.send(doctor);
        });

    });
});
router.get('/set/test', function(req,res,err){
    Doctor.find({
        geolocation: {
         $near: {
          $maxDistance: 1000,
          $geometry: {
           type: "Point",
           coordinates: [28.173358, 75.516809]
          }
         }
        }
       }).find((error, results) => {
        if (error) console.log(error);
        console.log(JSON.stringify(results, 0, 2));
        res.send(JSON.stringify(results, 0, 2));
       });
});
module.exports= router;