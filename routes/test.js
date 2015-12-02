var express = require('express');
var router = express.Router();
var levelDatas = require('../models/levelData');


router.post('/', function(req, res, next) {
  // save data pass in to db
  require('connect-ensure-login').ensureLoggedIn();//find({country_id : 10}).sort({score : -1}).limit(1)
  levelDatas.levelData.find({}).sort({id : -1}).limit(1).exec(function(err, max){ // insert record
console.log(max[0]);
    console.log( "max of levels:", max[0].id );
    var nextId = max[0].id +1;
    var levelData = req.param("LevelInfo");
    levelDatas.levelData.create({
      id: nextId,
      creator: req.param("author"),
      data: levelData
    }).then(function(levelData) {
      var newId =max[0].id +1;
      console.log(" id generated is " + newId);
      res.send('hello world'+ req.param('author') + newId + levelData); // response string with parameter sent
    });
  })
});

module.exports = router;
