var express = require('express');
var router = express.Router();
var levelDatas = require('../models/levelData');
var users = require('../models/user');

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
  var UserResult;
  var LevelResult;
  users.UserDetails.count({}, function(err, count){ // counting number of record
    if (count) {
      console.log( "Number of users:", count );
      users.UserDetails.find({}, function(err, result){ // retrieving record
          if (result) {
              Result = result;
              var re = [];
              for (i = 0; i < count; i++) {
                re.push({name:Result[i].displayName,point:Result[i].pointsGet});
              }
                var displayName = "";
                if(!req.user) {
                    displayName = undefined;
                } else {
                    displayName = req.user.displayName;
                }
            res.render('rank', { title: 'Rankings', displayName:displayName, rankData: rankData, result: re});
          }
      });
    }
  });
});

module.exports = router;
