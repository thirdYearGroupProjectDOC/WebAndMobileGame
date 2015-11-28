var express = require('express');
var router = express.Router();
var levelDatas = require('../models/levelData');

/* GET home page. */
router.get('/', function(req, res, next) {
  require('connect-ensure-login').ensureLoggedIn();
  var levelCount = 0;
  levelDatas.levelData.count({}, function(err, count){ // counting number of record
    if (count) {
      console.log( "Number of levels:", count );
      levelCount = count;
    }
  });

  levelDatas.levelData.findOne({id : 1}, function(err, result){ // retrieving record
      if (result) {
          console.log(result.data);
      }
  });
  var Result;
  levelDatas.levelData.find({}, function(err, result){ // retrieving record
      if (result) {
          Result = result;
          console.log(result);
          var ds = [];
          for (i = 0; i < levelCount; i++) {
            var thisResult = JSON.parse(Result[i].data);
            ds.push({id:Result[i].id,title:thisResult.title,description:thisResult.description});
          }
          console.log(ds);
          //var levelCount = 4;
          console.log("hey");
            var displayName = "";
            if(!req.user) {
                displayName = undefined;
            } else {
                displayName = req.user.displayName;
            }
          console.log(ds);
          res.render('levels', { title: 'Select Levels', levelCount: levelCount, uname: displayName, displayName: displayName, ds:ds});
      }
  });


});

/*

*/
router.post('/', function(req, res) {
    require('connect-ensure-login').ensureLoggedIn();
    console.log("levels post called");
    var deleteId = req.param("did");
    console.log(deleteId);
    if (!(isNaN(deleteId) ? !1 : (x = parseFloat(deleteId), (0 | x) === x))) {
      console.log("deleteId is not an integer");
      res.send('deleteId is not an integer');
    } else {
      console.log("deleteId is an integer");
      levelDatas.levelData.count({}, function(err, count){ // counting number of record
        if (count) {
          console.log( "Number of levels:", count );
          if (deleteId <= 0 || deleteId > count) {
            console.log("deleteId is not in correct range");
            res.send('deleteId is not in correct range');
          } else {
            levelDatas.levelData.remove({id: deleteId}, function(error){
              if (!error) {
                console.log("remove success");
                res.send('remove success');
              } else {
                console.log("remove error");
                res.send('remove error');
              }
            });
          }

        }
      });
    }
    console.log(deleteId);
  /*  levelDatas.levelData.count({}, function( err, count){ // insert record
      console.log( "Number of levels:", count );
      levelDatas.levelData.create({
        id: 1,
        data: {
        "author": "Sam",
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
      }).then(function(levelData) {
          console.log(" id generated is " + user.id);
      });
    })
*/
});


module.exports = router;
