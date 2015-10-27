var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('<html><body><script src="/socket.io/socket.io.js"></script><script>var socket = io();</script></body> </html> ');
});

module.exports = router;
