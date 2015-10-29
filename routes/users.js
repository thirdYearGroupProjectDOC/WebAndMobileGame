
var express = require('express');
var router = express.router;


var records = [
    {id: 1, username: 'Yujun', password: 'secret', displayName: 'Jon',
    emails:[{value: 'yujun@example.com'}]}
];

exports.findById = function(id, cb) {
   process.nextTick(function() {
     var idx = id - 1;
     if (records[idx]) {
       cb(null, records[idx]);
     } else {
       cb(new Error('User ' + id + ' does not exist'));
     }
   });
}

exports.findByUsername = function(user, cb) {
    process.nextTick(function(){
        for(var i = 0, len = records.length;i < len; i++){
            var record = records[i];
            if(record.username === user.username){
                return cb(null, record);
            }
        }
        return cb(null, null);
    });
}

//module.exports = router;