

var express = require('express');
var router = express.Router();
var passport = require('passport');
var users = require('../models/user');


router.get('/', function(req, res, next) {
  res.render('register');
});

router.post('/', function(req, res) {
    if (req.param('password') !== req.param('password2')) {
      res.render('register', { errormsg: 'Password and confirm password did not match. Try it again :D' });
      return;
    }
    users.UserDetails.findOne({ where: {username: req.param('username')} }).then(function(user) {
      if (user != null) {
        res.render('register', { errormsg: 'This username already exists. Try something else :D' });
        return;
      }
      console.log(users.UserDetails.schema);
      users.UserDetails.create({
          username: req.param('username'),
          password: req.param('password'),
          displayName: req.param('displayName')
      }).then(function(user) {
          console.log("User id generated is " + user.id);
          req.login(user, function(err){
            if (err) { return next(err);}
            return res.redirect('/home');
          });

      });
    })
});


module.exports = router;
