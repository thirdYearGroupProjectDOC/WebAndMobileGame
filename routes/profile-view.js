var express = require('express');
var router = express.Router();
var passport = require('passport');
var users = require('../models/user');

router.get('/',
   require('connect-ensure-login').ensureLoggedIn(),
   function(req, res){
     res.render('profile-view', { user: req.user, displayName: req.user.displayName});
});

module.exports = router;
