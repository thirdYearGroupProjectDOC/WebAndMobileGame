var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var levelCount = 4;
  require('connect-ensure-login').ensureLoggedIn(),
  res.render('levels', { title: 'Homepage', levelCount: levelCount });
});


module.exports = router;
