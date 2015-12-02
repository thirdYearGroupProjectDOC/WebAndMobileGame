var express = require('express');
var router = express.Router();
var levelDatas = require('../models/levelData');

/* GET home page. */
router.get('/', function(req, res, next) {
  require('connect-ensure-login').ensureLoggedIn();
  var levelCount = 0;
  levelDatas.levelData.count({$or:[{creator: req.user.displayName},{creator:"all"}]}, function(err, count){ // counting number of record
    if (count) {
      console.log( "Number of levels:", count );
      levelCount = count;
    }
  });
  levelDatas.levelData.count({}, function(err, count){ // counting number of record
    if (count) {
      console.log( "Number of levels:", count );
      levelCount = count;
    }
  });

  var Result;
  levelDatas.levelData.find({$or:[{creator: req.user.displayName},{creator:"all"}]}, function(err, result){ // retrieving record
      if (result) {
          Result = result;
          console.log(result);
          var ds = [];
          for (i = 0; i < levelCount; i++) {
            var thisResult = JSON.parse(Result[i].data);
            ds.push({id:Result[i].id,title:thisResult.title, author:thisResult.author,creator:Result[i].creator,description:thisResult.description});
          }
          console.log(ds);
            var displayName = "";
            if(!req.user) {
                displayName = undefined;
            } else {
                displayName = req.user.displayName;
            }
          res.render('levels', { title: 'Select Levels', levelCount: levelCount, uname: displayName, displayName: displayName, ds:ds});
      }
  });


});

/*

*/
router.post('/', function(req, res) { // delete level
    require('connect-ensure-login').ensureLoggedIn();
    console.log("levels post called");
    var deleteId = req.param("did");
    console.log(deleteId);
    if (!(isNaN(deleteId) ? !1 : (x = parseFloat(deleteId), (0 | x) === x))) {
      console.log("deleteId is not an integer");
      res.send('deleteId is not an integer');
    } else {
      console.log("deleteId is an integer");
      levelDatas.levelData.findOne({$and:[{id: deleteId},{creator: req.user.displayName}]}, function(err, exist){ // counting number of record
        if (exist) {
          if (deleteId <= 0) {
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
        } else {
          console.log("level doesnt exist");
          res.send('level doesnt exist');
        }
      });
    }
    console.log(deleteId);
});


module.exports = router;
