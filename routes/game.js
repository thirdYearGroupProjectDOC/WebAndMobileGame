var express = require('express');
var router = express.Router();
var levelDatas = require('../models/levelData');

router.get('/',function(req, res, next){
    require('connect-ensure-login').ensureLoggedIn();
    var displayName = "";
     if(!req.user) {
         displayName = undefined;
     } else {
         displayName = req.user.displayName;
     }
     var levelD;
     var lid = req.query.level; // find id : lid
     console.log("lid = " + lid);
      levelDatas.levelData.findOne({id : lid}, function(err, result){ // get from mongoDB the level config with id = 1
        if (result) { // acutally we should use req.query.level to be the id in requery
          levelD = result.data; // store json format result in levelD
          levelD = JSON.parse(levelD);
          res.render('game', { user: req.user, displayName: displayName, level: req.query.level, levelData: levelD});
          // render game page with parameter
        }
      });
});


module.exports = router;
