var express = require('express');
var router = express.Router();



router.post('/', function(req, res, next) {
  require('connect-ensure-login').ensureLoggedIn();
  res.send('hello world'+ req.param('a2')); // response string with parameter sent
});

module.exports = router;
