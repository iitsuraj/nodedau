var router = require('express').Router();
var randomstring = require("randomstring");
var User = require('../models/user');
var Doctor = require('../models/doctor');
var mailer = require('../misc/mailer');
var async = require("async");
var passport = require("passport");
var passportConf = require('../config/passport');

router.get('/user/register', function(req,res,next){
  res.render('main/signup',{title:'user-signup'})
});
router.post('/user/register', function(req,res,next){
    async.waterfall([
        function(callback){
            var user = new User();
            var token = randomstring.generate(4);
            user.profile.name = req.body.name;
            user.profile.age = req.body.age;
            user.profile.gender = req.body.gender;
            user.email = req.body.email;
            user.password = req.body.password;
            user.activeToken = token;
            User.findOne({ email: req.body.email }, function(_err, existingUser) {
                if (existingUser) {
                  console.log( "Account with that email address already exists");
                  return res.json("/signup");
                } else {
                  user.save(function(err, user) {
                    if (err) return next(err);
                    // res.json('New User has been created')
                    // return res.redirect("/");            
                    callback(null, user);
                  });
                }
              })
        },
        function(user,callback){
            var html = 'hey user click this link to get verified  <a href="http://localhost:3000/user/verify/'+user.activeToken+'" target="_blank">http://localhost:3000/user/verify/'+user.activeToken+'</a>';
            mailer.sendEmail('suraj@hi.com', user.email, 'verify email',html);
            console.log('email send to client');
            res.redirect('/')
        }
    ])
});
// router.post('/verify', function(req,res,next){
//     User.findOne({ activeToken: req.body.token }, function (err, user) {
//         if (!user) {
//             res.json('invalid token');
//         }
//         user.activeToken = undefined;
//         user.active = true;
//         user.save(function (_err) {
//             if (_err) next(_err);
//             res.json("verified user")
//         });
//     });
// });
router.get('/user/verify/:token', function(req,res,next){
    User.findOne({activeToken: req.params.token}, function(err, user){
        if(err) next(err);
        if(!user){
            res.json(" invalid token")
        }
        user.activeToken = undefined;
        user.active = true;
        user.save(function(err){
            if(err) next(err);
            res.json("verified user")
        });
    });
});
router.get('/user/login', function(req,res,next){
  res.render('main/login', {
    title:'user-login'
  })
})
router.post("/user/login", passport.authenticate('user-local', {
successRedirect: '/profile',
failureRedirect: '/user/login',
failureFlash: true,
}));

router.get('/doctor/register',function(req,res,next){
  res.render('main/doctor-signup',{title:'doctor-signup'})
})
router.post('/doctor/register', function(req,res,next){
    async.waterfall([
        function(callback){
            var doctor = new Doctor();
            var token = randomstring.generate(4);
            doctor.profile.name = req.body.name;
            doctor.profile.age = req.body.age;
            doctor.profile.gender = req.body.gender;
            doctor.profile.telephone = req.body.telephone;
            doctor.email = req.body.email;
            doctor.password = req.body.password;
            doctor.activeToken = token;
            doctor.category = req.body.category;
            doctor.address.city = req.body.city;
            doctor.address.state = req.body.state;
            doctor.address.address = req.body.address;
            Doctor.findOne({ email: req.body.email }, function(_err, existingDoctor) {
                if (existingDoctor) {
                  console.log( "Account with that email address already exists");
                  return res.json("/signup");
                } else {
                  doctor.save(function(err, doctor) {
                    if (err) return next(err);
                    // res.json('New User has been created')
                    // return res.redirect("/");            
                    callback(null, doctor);
                  });
                }
              })
        },
        function(doctor,callback){
            var html = 'hey user click this link to get verified  <a href="http://localhost:3000/doctor/verify/'+doctor.activeToken+'" target="_blank">http://localhost:3000/doctor/verify/'+doctor.activeToken+'</a>';
            mailer.sendEmail('suraj@hi.com', doctor.email, 'verify email',html);
            console.log('email send to client');
            res.redirect('/')
        }
    ])
});
router.get('/doctor/verify/:token', function(req,res,next){
    Doctor.findOne({activeToken: req.params.token}, function(err, doctor){
        if(err) next(err);
        if(!doctor){
            res.json(" invalid token")
        }
        doctor.activeToken = undefined;
        doctor.active = true;
        doctor.save(function(err){
            if(err) next(err);
            res.json("verified user")
        });
    });
});
router.get('/doctor/login', function(req,res,next){
  res.render('main/login', {
    title: 'doctor-login'
  })
})
router.post("/doctor/login", passport.authenticate('doctor-local', {
successRedirect: '/profile',
failureRedirect: 'doctor/login',
successFlash: true,
failureFlash: true

}));

router.get("/profile",passportConf.isAuthenticated, function(req, res, next){
  var userPrototype =  Object.getPrototypeOf(req.user);
  if (userPrototype === Doctor.prototype) {
    res.render('panel-body/profile', {
      title: 'profile',
      userType: 'doctor',
      user: req.user
    });
  } else if (userPrototype === User.prototype) {
    res.render('panel-body/profile', {
      title: 'profile',
      userType: 'user',
      user: req.user
    });
  }
});
router.post('/profile', function(req,res,next){
  // if (req.body.title[0] != '') {
  //   console.log(req.body.title)
  // } else {
  //   console.log(req.body);
  // }
  var userPrototype =  Object.getPrototypeOf(req.user);
  if (userPrototype === Doctor.prototype){
    Doctor.findById(req.user._id, function(err,user){
      if(req.body.telephone) user.telephone = req.body.telephone;
      if(req.body.ps) user.curriculm.professionalstatement = req.body.ps; 
      if(req.body.specialization){
        var specialization = req.body.specialization;
        var spec = specialization.split(',');
        for (var i=0; i<spec.length; i++){
          // console.log(spec[i]);
          user.curriculm.specialization.push({
            category: spec[i]
          })
          };
        }
        if(req.body.title[0] != ''){
          for (i=0; i < req.body.title.length; i++){
              // console.log(req.body.title[i]+'-'+req.body.price[i])
              user.pricing.push({
                  title: req.body.title[i],
                  price: req.body.price[i]
              })
          }
      }
      user.save(function(err){
        if(err) return next(err);
        return res.redirect('/profile');
      });
    })
  } else if (userPrototype === User.prototype){
    user.findById(req.user._id, function(err,user){
      if(req.body.telephone) user.telephone = req.body.telephone;
      user.save(function(err){
        if(err) return next(err);
        return res.redirect('/profile');
      });
    })
  }
})
router.get("/logout", function(req, res , _next){
  req.logOut();
  res.redirect("/");
});

module.exports = router;