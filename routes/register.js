var express = require('express');
var router = express.Router();
var passport = require('passport');
var users = require('../models/user');
var bcrypt = require('bcrypt');


router.get('/', function(req, res, next) {
  res.render('register');
});

router.post('/', function(req, res) {
    console.log(req.body.username);
    if (req.body.password !== req.body.password2) {
      res.render('register', { errormsg: 'Password and confirm password did not match. Try it again :D' });
      return;
    }
    process.nextTick(function() {
        users.UserDetails.findOne({username : req.body.username},
        function(err, user){
            if (user) {
                res.render('register', { errormsg: 'This username already exists. Try something else :D' });
                return ;
            }

            bcrypt.genSalt(function (err, salt) {
                if (err) {
                    throw err;
                }

                bcrypt.hash(req.body.password, salt, function(err, hash){
                    if (err) {
                        throw err;
                    }

                    //console.log(hash);

                    users.UserDetails.create({
                        username: req.body.username,
                        password: hash,
                        displayName: req.body.displayName
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
