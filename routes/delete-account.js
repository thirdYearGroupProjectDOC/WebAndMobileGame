var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function(req, res, next) {
  res.render('delete-account', { user: req.user, displayName: req.user.displayName});
});

router.post('/',
  passport.authenticate('local', {failureRedirect: '/home'}),
  function(req, res){
    var user = req.user;
    req.logout();
    user.remove();
    res.redirect('/home');
  }
);

module.exports = router;
