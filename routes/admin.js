var express = require('express');
var router = express.Router();
var admin = new express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

var requiresAdmin = function() {
  return [
    ensureLoggedIn('/login'),
    function(req, res, next) {
      if (req.user && req.user.isAdmin === true)
        next();
      else
        res.send(401, 'Unauthorized');
    }
  ]
};

admin.all('/*', requiresAdmin());

admin.get('/admin', function (req, res) {
  res.render('admin');
});

admin.get('/manage', function(req,res){
  res.render('adminManagement')
});

router.use('/', admin);



module.exports = router;