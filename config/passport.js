var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Doctor = require('../models/doctor');


function SessionConstructor(userId, userGroup, details) {
    this.userId = userId;
    this.userGroup = userGroup;
    this.details = details;
  }
  passport.serializeUser(function (user, done) {
    // userObject could be a Model1 or a Model2... or Model3, Model4, etc.
    let userGroup = "model1";
    let userPrototype =  Object.getPrototypeOf(user);

    if (userPrototype === User.prototype) {
      userGroup = "model1";
    } else if (userPrototype === Doctor.prototype) {
      userGroup = "model2";
    }

    let sessionConstructor = new SessionConstructor(user._id, userGroup, '');
    done(null,sessionConstructor);
  });

  passport.deserializeUser(function (sessionConstructor, done) {

    if (sessionConstructor.userGroup == 'model1') {
      User.findOne({
          _id: sessionConstructor.userId
      }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
          done(err, user);
      });
    } else if (sessionConstructor.userGroup == 'model2') {
      Doctor.findOne({
          _id: sessionConstructor.userId
      }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
          done(err, user);
      });
    } 

  });
// passport.serializeUser(function(user, done){
//   done(null, user._id);
// });

// passport.deserializeUser(function(id, done){
//   User.findById(id, function(err, user){
//       done(err, user);
//   });
// });
// midelware
passport.use('user-local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password', // this is the virtual field on the model
    passReqToCallback: true
  },
  function(req,email, password, done) {
    User.findOne({
      email: email
    }, function(err, user) {
      if (err) return done(err);

      if (!user) {
        return done(null, false, console.log("nouser"));
      }
      if (!user.comparePassword(password)) {
        return done(null, false, console.log("passwordwrong"));
      }
      // if (!user.active){
      //   return done(null, false, console.log("notactive"));
      // }
      return done(null, user);
    });
  }
));

  // add other strategies for more authentication flexibility
  passport.use('doctor-local', new LocalStrategy({
          usernameField: 'email',
          passwordField: 'password', // this is the virtual field on the model
          passReqToCallback: true
      },
      function(req, email, password, done) {
          Doctor.findOne({
              email:email
          }, function(err, user) {
              if (err) return done(err);

              if (!user) {
                  return done(null, false, console.log("nodoctor"));
              }
              if (!user.comparePassword(password)) {
                  return done(null, false, console.log("password error"));
              }
              // if (!user.active){
              //   return done(null, false, console.log("notactive"));
              // }
              return done(null, user);
          });
      }
  ));

// custom function to validate
exports.isAuthenticated = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/user/login');
} 