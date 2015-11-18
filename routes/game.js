var express = require('express');
var router = express.Router();

router.get('/',
   require('connect-ensure-login').ensureLoggedIn(),
   function(req, res){
     var displayName = "";
     if(!req.user) {
         displayName = undefined;
     } else {
         displayName = req.user.displayName;
     }
     res.render('game', { user: req.user, displayName: displayName, level: req.query.level, levelData:{
     "dimen": 5,
     "start":[{"Coor":"1,0", "Dir":"1"}],
     "end":[{"Coor":"5,6", "Dir":"3"}],

     "straight": 5,
     "endPoint": 5,
     "threeWay": 5,
     "turn": 5,

     "snake":[{"Coor":"2,2", "Dir":"0"}],
     "tree":[{"Coor":"3,3", "Dir":"0"}]
     }}); //setting: json
});


module.exports = router;
