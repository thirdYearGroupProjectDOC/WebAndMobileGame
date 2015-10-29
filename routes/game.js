var express = require('express');
var router = express.Router();


router.get('/',
   require('connect-ensure-login').ensureLoggedIn(),
   function(req, res){
     res.render('game', { user: req.user });
});


module.exports = router;