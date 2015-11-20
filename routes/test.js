var express = require('express');
var router = express.Router();



router.post('/', function(req, res, next) {
  require('connect-ensure-login').ensureLoggedIn();
  res.send('hello world'+ req.param('a2')); // response string with parameter sent
  /*
// Save json format level data to mongo db
levelDatas.levelData.count({}, function( err, count){ // insert record
  console.log( "Number of levels:", count );
  levelDatas.levelData.create({
  id: count+1,
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
  */
});

module.exports = router;
