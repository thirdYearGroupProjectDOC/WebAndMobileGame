var mongoose = require('mongoose');


var Schema = mongoose.Schema;
var UserDetail = new Schema({
        username: String,
        password: String,
        displayName: String
      }, {
        collection: 'userInfo'
      }
);

var UserDetails = mongoose.model('userInfo', UserDetail);

exports.UserDetails = UserDetails;
