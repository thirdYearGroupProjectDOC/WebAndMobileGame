var express = require('express');
var router = express.Router();
var passport = require('passport');
var users = require('../models/user');

router.get('/',
   require('connect-ensure-login').ensureLoggedIn(),
   function(req, res){
     res.render('profile-edit', { user: req.user, displayName: req.user.displayName});
});

router.post('/',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res) {
      if (req.param('password') !== req.param('password2')) {
        return res.render('profile-edit', { user: req.user, errormsg: 'Password and confirm password did not match.'});
      }
      users.UserDetails.findOneAndUpdate(
        {username: req.user.username},
        {password: req.param('password'), displayName: req.param('displayName')},
        function (err, user) {
          return res.redirect('/profile-view');
      });
});

module.exports = router;
