var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var displayName = "";
  if(!req.user) {
      displayName = undefined;
  } else {
      displayName = req.user.displayName;
  }
  res.render('about', { title: 'About', displayName: displayName});
});

module.exports = router;
