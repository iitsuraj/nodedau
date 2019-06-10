var router = require('express').Router();
var Doctor = require('../models/doctor');
var User = require('../models/user');
var passportConf = require('../config/passport');
var mongoose = require('mongoose');

router.get('/home', function(req,res,next){
    res.render('panel-body/dashboard', { title: 'home', user: req.user });
});
router.get('/booking',passportConf.isAuthenticated, function(req,res,next){
    var userPrototype = Object.getPrototypeOf(req.user);
    if (userPrototype === Doctor.prototype){
        Doctor.findById({_id: req.user._id}).populate('booking.patient').exec(function(err, doctor){
            if(err) next(err);
            res.render('panel-body/booking', { title: 'home', user: doctor });
        });
    } else if (userPrototype===User.prototype){
        res.send('you not have access to view this page')
    }
    });
router.get('/category', function(req,res,next){
    res.render('main/category', { title: 'home', user: req.user });
});
router.get('/doctors/:id',passportConf.isAuthenticated, function(req,res,next){
    Doctor.find({category:req.params.id})
    .populate("category")
    .exec(function(err, doctors){
        if (err) return next (err);
        res.render('main/doctors', {doctors: doctors, title:'doctors', user: req.user})
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
                // res.render('main/doctor', {
                //     doctor: doctor, title: 'doctor'
                // })
                // console.log(doctor); 
               
            }
        ) 
    } else {
        res.send('404')
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
            // console.log(user.bookmark[0].doctor);
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
module.exports= router;