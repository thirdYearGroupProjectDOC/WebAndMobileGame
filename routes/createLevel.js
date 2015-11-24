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
  res.render('createLevel', { title: 'Create', uname: displayName, displayName:displayName,levelData: 222});
});


router.post('/', function(req, res, next) {
  require('connect-ensure-login').ensureLoggedIn();

});


module.exports = router;
