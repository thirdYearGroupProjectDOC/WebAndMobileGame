var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var levelCount = 4;
  require('connect-ensure-login').ensureLoggedIn();
  console.log(req.user.displayName);
  res.render('levels', { title: 'Homepage', levelCount: levelCount, uname: req.user.displayName});//uname: req.query.uname,
});


module.exports = router;
