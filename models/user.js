'use strict';

var mongoose = require('mongoose');
var Firebase = require('firebase');
var jwt = require('jwt-simple');

var JWT_SECRET = process.env.JWT_SECRET;

var ref = new Firebase('https://20160128.firebaseio.com/')

var User;

var userSchema = mongoose.Schema({
  uid: { type: String, required: true },
  email: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  phone: { type: String },
  // albums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }],
  imageurl: { type: String },
  summary: { type: String }, 
  aboutme: { 
    gender: { type: String }, 
    orientation: { type: String } 
  },
  lookingfor: { 
    gender: { type: String },
    orientation: { type: String }
  },
  interests: [{type: String}],
  faveOtters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});


userSchema.statics.register = function (userObj, cb) {
  if(!userObj.email || !userObj.password){
    return cb("Missing required field (email, password)");
  }
  ref.createUser(userObj, function(err, userData) {
    if(err) return cb(err);
    User.create({
      uid: userData.uid,
      email: userObj.email,
      firstname: userObj.firstname || '', 
      lastname: userObj.lastname || '',
      phone: userObj.phone || ''
    }, cb);
  });
};

userSchema.statics.login = function(userObj, cb) {
  if(!userObj.email || !userObj.password){
    return cb("Missing required field (email, password)");
  }
  ref.authWithPassword(userObj, function(err, authData) {
    if(err) return cb(err);
    User.findOne({uid: authData.uid}, function(err, user) {
      if(err || !user) return cb(err || 'User not found in db.');
      var token = user.generateToken();
      cb(null, user, token);
    });
  });
};

userSchema.methods.generateToken = function() {
  var payload = {
    uid: this.uid,
    _id: this._id, 
    email: this.email
  };
  var token = jwt.encode(payload, JWT_SECRET); 
  console.log("HERE'S THE TOKEN", token);
  return token;
}


// userSchema.statics.editProfile = function(userObj, cb) {
  
//   User.findOne({uid: authData.uid}, function(err, user) {
//     if(err || !user) return cb(err || 'User not found in db.');
//     var token = user.generateToken();
//     cb(null, user, token);
//   });
// };




User = mongoose.model('User', userSchema);

module.exports = User;