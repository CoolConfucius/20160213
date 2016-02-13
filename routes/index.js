'use strict';

var express = require('express');
var router = express.Router();
var authMiddleware = require('../config/auth');
var User = require('../models/user');

/* GET home page. */
router.get('/', authMiddleware, function(req, res, next) {
  console.log("req.user: ", req.user);
  console.log("cookies: ", req.cookies);
  res.render('index');
});

router.get('/otters', authMiddleware, function(req, res, next) {
  // User.findById(req.user._id, function(err, user) {
    User
    .find({'_id': { $ne: req.user._id}})
    .exec(function(err, users) {
      console.log(users, "USERS");
      if(err) return res.status(400).send(err); 
      res.send(users); 
    })
  // });
}); 

router.put('/likeotter', authMiddleware, function(req, res, next) {
  User.findById(req.user._id, function(err, user) {
    user.fave
  });
}); 


module.exports = router;
