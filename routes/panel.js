var router = require('express').Router();
var passportConf = require('../config/passport');
var Doctor = require('../models/doctor');
var User = require('../models/user');


router.get('/', function(req,res,next){
    res.render('panel-body/dashboard', { title: 'home'});
});
router.get('/booking', function(req,res,next){
    var userPrototype = Object.getPrototypeOf(req.user);
    if (userPrototype === Doctor.prototype){
        Doctor.findById({_id: req.user._id}).populate('booking.patient').exec(function(err, doctor){
            if(err) next(err);
            res.render('panel-body/booking', { title: 'home', user: doctor,  userType : 'doctor' });
        });
    } else if (userPrototype===User.prototype){
        User.findById({_id: req.user._id}).populate('booking.doctor').exec(function(err, user){
            if(err) next(err);
            res.render('panel-body/booking', { title: 'home', user: user,  userType : 'user' });
        });
    }
    });
router.get('/bookmarks', function(req,res,next){
        var userPrototype =  Object.getPrototypeOf(req.user);
        if (userPrototype === Doctor.prototype){
            Doctor.findById({_id: req.user._id}).populate({path:'bookmark.doctor',populate: { path: 'category' }}).exec(function(err, user){
                if (err) return next(err);
                res.render('panel-body/bookmarks', {user: user});
            });
        } else if (userPrototype===User.prototype){
            User.findById(req.user._id).populate({path:'bookmark.doctor',populate: { path: 'category' }}).exec(function(err, user){
                if (err) return next(err);
                res.render('panel-body/bookmarks', {user: user});
                // console.log(user);
            });
        }
    });
router.post('/bookmarks',passportConf.isAuthenticated, function(req,res,next){
        var userPrototype =  Object.getPrototypeOf(req.user);
    if (userPrototype === Doctor.prototype){
        Doctor.findById(req.user._id, function(err, user){
            if (err) next (err);
            var today = new Date();
            user.bookmark.push({
                doctor: req.body.doctor_id,
                date: today
            });
            user.save(function(err){
                if (err) next (err);
                return res.status(200).send('bookmarkAdded');
            });
        });
    } else if (userPrototype===User.prototype){
        User.findById(req.user._id, function(err, user){
            if (err) next (err);
            var today = new Date();
            user.bookmark.push({
                doctor: req.body.doctor_id,
                date: today
            });
            user.save(function(err){
                if (err) next (err);
                return res.status(200).send('bookmarkAdded');
            });
        });
    }
    });
router.post('/bookmark-remove', function(req,res,next){
        var userPrototype = Object.getPrototypeOf(req.user);
        if (userPrototype === Doctor.prototype){
            Doctor.findById(req.user._id, function(err, user){
                if (err) next (err);
                user.bookmark.pull(String(req.body.bookmark_id));
                user.save(function(err){
                    if (err) next (err);
                    return res.status(200).send("removed");
                });
            });
        } else if (userPrototype===User.prototype){
            User.findById(req.user._id, function(err, user){
                if (err) next (err);
                user.bookmark.pull(String(req.body.bookmark_id));
                user.save(function(err){
                    if (err) next (err);
                    return res.status(200).send("removed");
                });
            });
        }
    });
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

module.exports = router;