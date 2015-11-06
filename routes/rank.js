var express = require('express');
var router = express.Router();
var levelDatas = require('../models/levelData');

/* GET home page. */
router.get('/', function(req, res, next) {
  require('connect-ensure-login').ensureLoggedIn();
  var displayName = "";
  if(!req.user) {
        displayName = undefined;
  } else {
        displayName = req.user.displayName;
  }
  var rankData = 5;
  res.render('rank', { title: 'Rankings', displayName:displayName, rankData: rankData});
});

module.exports = router;
