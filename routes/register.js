var express = require('express');
var router = express.Router();
var passport = require('passport');
var users = require('../models/user');
var bcrypt = require('bcrypt');


router.get('/', function(req, res, next) {
  res.render('register');
});

router.post('/', function(req, res) {
    if (req.param('password') !== req.param('password2')) {
      res.render('register', { errormsg: 'Password and confirm password did not match. Try it again :D' });
      return;
    }
    process.nextTick(function() {
        users.UserDetails.findOne({username : req.param('username')}, function(err, user){
            if (user) {
                res.render('register', { errormsg: 'This username already exists. Try something else :D' });
                return ;
            }
            bcrypt.genSalt(function (err, salt) {
                if (err) {
                    throw err;
                }

                bcrypt.hash(req.param('password'), salt, function(err, hash){
                    if (err) {
                        throw err;
                    }

                    //console.log(hash);

                    users.UserDetails.create({
                        username: req.param('username'),
                        password: hash,
                        displayName: req.param('displayName')
                    }).then(function(user) {
                        console.log("User id generated is " + user.id);
                        req.login(user, function(err){
                        if (err) {
                            return next(err);
                        }
                        return res.redirect('/levels');
                        });
                    });
                });

            });

        });
    });
});


module.exports = router;
