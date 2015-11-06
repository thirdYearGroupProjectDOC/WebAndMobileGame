var express = require('express');
var router = express.Router();
var levelDatas = require('../models/levelData');

/* GET home page. */
router.get('/', function(req, res, next) {
  require('connect-ensure-login').ensureLoggedIn();
  res.render('createLevel', { title: 'Create', uname: req.user.displayName});
});

module.exports = router;
