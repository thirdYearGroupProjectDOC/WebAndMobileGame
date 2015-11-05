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
     res.render('game', { user: req.user, displayName: displayName, level: req.query.level}); //setting: json
});


module.exports = router;
