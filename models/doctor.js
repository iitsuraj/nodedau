var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Category = require('./category');
var User = require('./user');


var DoctorSchema = new Schema({
    profile: {
        name: {type: String, default: ''},
        picture: {type: String, default: ''},
        age: Number,
        gender: String,
        telephone: Number,
    },
    address:{
        city: String,
        address: String,
        state: String,
        zipcode: String,
        ip: []
    },
    geolocation: {
        type: { type: String, default:'Point' }, coordinates: [Number]
       },
    curriculm:{
        professionalstatement: String,
        specialization:[{
            category: String
        }],
    },
    pricing:[{
        title: String,
        price: Number,
    }],
    booking:[{
        date: Date,
        visitdate: Date,
        slote: String,
        msg: String,
        patient: {type: Schema.Types.ObjectId, ref: 'User'}
    }],
    category: {type: Schema.Types.ObjectId, ref: Category},
    email: {type: String,unique: true, lowercase: true, required: true},
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    activeToken: {type: String, default:''},
    active: {type:Boolean, default: false},
    bookmark:[{
        doctor: {type: Schema.Types.ObjectId, ref: 'Doctor'},
        date: Date
    }],
    rating:[
        {
            user: {type: Schema.Types.ObjectId, ref:'User'},
            date: Date,
            rate: Number,
            msg: String,
        }
    ]
},{
timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updateAt'
}
});

// hash
DoctorSchema.pre('save', function(next) {
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

// DoctorSchema.pre('save', function(next){
//     var user = this;
//     var emailx = user.email;
//     var emailarray = emailx.split('@');
//     var caide = emailarray[0];
//     console.log(caide);
//     user.caid = caide;
//     next();
// })

//password check
DoctorSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};
DoctorSchema.index({geolocation: "2dsphere" });
module.exports = mongoose.model('Doctor', DoctorSchema);