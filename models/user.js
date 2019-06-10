// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt-nodejs');
// var crypto = require('crypto');


// var UserSchema = new Schema({
//     profile: {
//         name: {type: String, default: ''},
//         picture: {type: String, default: ''},
//         age: Number,
//         addresh: {type: String, default: ''},
//         gender: String
//     },
//     email: {type: String,unique: true, lowercase: true, required: true},
//     password: String,
//     history: [{
//         doctor: { type: Schema.Types.ObjectId, ref: 'Product'},
//         doctorPrice: {type: Number, default: 0}
//         }],
//     // review: {type: String, default: ''},
//     resetPasswordToken: String,
//     resetPasswordExpires: Date,
//     ip: String,
//     activeToken: {type: String, default:''},
//     active: {type:Boolean, default: false}
// },{
// timestamps: {
//     createdAt: 'createdAt',
//     updatedAt: 'updateAt'
// }
// });

// // hash
// UserSchema.pre('save', function(next) {
//     var user = this;
//     if(!user.isModified('password')) return next();
//     bcrypt.genSalt(10, function(err, salt){
//         if(err) return next(err);
//         bcrypt.hash(user.password, salt, null, function(err, hash){
//             if(err) return next(err);
//             user.password = hash;
//             next();
//         });

//     });
// });

// //campuscode

// UserSchema.pre('save', function(next){
//     var user = this;
//     var emailx = user.email;
//     var emailarray = emailx.split('@');
//     var caide = emailarray[0];
//     console.log(caide);
//     user.caid = caide;
//     next();
// })

// //password check
// UserSchema.methods.comparePassword = function(password){
//     return bcrypt.compareSync(password, this.password);
// };
// module.exports = mongoose.model('User', UserSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Doctor = require('./doctor');

var UserSchema = new Schema({
    profile: {
        name: {type: String, default: ''},
        picture: {type: String, default: ''},
        age: Number,
        addresh: {type: String, default: ''},
        gender: String
    },
    email: {type: String,unique: true, lowercase: true, required: true},
    password: String,
    telephone : {type: Number, default: '9876543210'},
    bookmark:[{
        doctor: {type: Schema.Types.ObjectId, ref: 'Doctor'},
        date : Date,
    }],
    // history: [{
    //     doctor: { type: Schema.Types.ObjectId, ref: 'Product'},
    //     doctorPrice: {type: Number, default: 0}
    //     }],
    // review: {type: String, default: ''},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    ip: String,
    activeToken: {type: String, default:''},
    active: {type:Boolean, default: false}
},{
timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updateAt'
}
});

// hash
UserSchema.pre('save', function(next) {
    var user = this;
    if(!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt){
        if(err) return next(err);
        bcrypt.hash(user.password, salt, null, function(err, hash){
            if(err) return next(err);
            user.password = hash;
            next();
        });

    });
});

//campuscode

UserSchema.pre('save', function(next){
    var user = this;
    var emailx = user.email;
    var emailarray = emailx.split('@');
    var caide = emailarray[0];
    console.log(caide);
    user.caid = caide;
    next();
})

//password check
UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.gravatar = function(size){
    if(!this.size) size = 200;
    if (!this.email) return 'https://gravatar.com/avatar/?s=' +size+ '&d=retro';
    var md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/' +md5+ '?s=' +size+ '&d=retro';
};
module.exports = mongoose.model('User', UserSchema);