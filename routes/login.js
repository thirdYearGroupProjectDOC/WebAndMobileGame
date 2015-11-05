

var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/',
  passport.authenticate('local', {failureRedirect: '/login'}),
  function(req, res){
    console.log(req.user.username);
    res.redirect('/levels');
  }
);


module.exports = router;
