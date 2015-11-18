var express = require('express');
var router = express.Router();



router.post('/', function(req, res, next) {
  require('connect-ensure-login').ensureLoggedIn(),
  res.send('hello world'+ req);
});

module.exports = router;
