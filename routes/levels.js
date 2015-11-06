var express = require('express');
var router = express.Router();
var levelDatas = require('../models/levelData');

/* GET home page. */
router.get('/', function(req, res, next) {
  require('connect-ensure-login').ensureLoggedIn();
  levelDatas.levelData.count({}, function(err, count){ // counting number of record
    if (count) {
      console.log( "Number of levels:", count );
    }
  });
  levelDatas.levelData.findOne({id : 1}, function(err, result){ // retrieving record
      if (result) {
          console.log(result.data);
      }
  });
  var levelCount = 4;
  console.log(req.user.displayName);
  res.render('levels', { title: 'Select Levels', levelCount: levelCount, uname: req.user.displayName});//uname: req.query.uname,
});

/*
{
"dimen": 5,
"start":[{"Coor":"1,0", "Dir":"1"}],
"end":[{"Coor":"5,6", "Dir":"3"}],

"straight": 5,
"endPoint": 5,
"threeWay": 5,
"turn": 5,

"snake":[{"Coor":"2,2", "Dir":"0"}],
"tree":[{"Coor":"3,3", "Dir":"0"}]
}

*/
router.post('/', function(req, res) {
    levelDatas.levelData.count({}, function( err, count){ // insert record
      console.log( "Number of levels:", count );
      levelDatas.levelData.create({
      id: 2,
      data: {
      "dimen": 5,
      "start":[{"Coor":"1,0", "Dir":"1"}],
      "end":[{"Coor":"5,6", "Dir":"3"}],

      "straight": 5,
      "endPoint": 5,
      "threeWay": 5,
      "turn": 5,

      "snake":[{"Coor":"2,2", "Dir":"0"}],
      "tree":[{"Coor":"3,3", "Dir":"0"}]
      }
      }).then(function(levelData) {
          console.log(" id generated is " + user.id);
      });
    })

});


module.exports = router;
