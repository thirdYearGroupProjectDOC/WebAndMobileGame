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
    var levelData = {
      id: 1,
      data: {
      "author": "Saaaaaam",
      "title": "Easy Level",
      "description": "This is an entry level",
      "dimen": 5,
      "start":[{"Coor":[1,0], "Dir":[1]}],
      "end":[{"Coor":[5,6], "Dir":[3]}],
      "rank":[],
      "straight": 5,
      "endPoint": 5,
      "threeWay": 5,
      "turn": 5,
      "snake":[{"Coor":"2,2", "Dir":"0"}],
      "tree":[{"Coor":"3,3", "Dir":"0"}]
    }
  };
  res.render('createLevel', { title: 'Create', uname: displayName, displayName:displayName,levelData: levelData});
});


router.post('/', function(req, res, next) {
  require('connect-ensure-login').ensureLoggedIn();

});


module.exports = router;
