var express = require('express');
var expressSession = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var mongoose = require('mongoose');

var users = require('./models/user');

var game = require('./routes/game');
var login = require('./routes/login');
var logout = require('./routes/logout');
var routes = require('./routes/welcome');
var register = require('./routes/register');
var about = require('./routes/about');
var home = require('./routes/home');
var levels = require('./routes/levels');
var profile_view = require('./routes/profile-view');
var profile_edit = require('./routes/profile-edit');
var delete_account = require('./routes/delete-account');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(expressSession({secret: 'secret', resave: false,
  saveUninitialized: false}));

app.use(passport.initialize());
app.use(passport.session())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/game', game);
app.use('/login', login);
app.use('/logout', logout);
app.use('/about', about);
app.use('/home', home);
app.use('/levels', levels);
app.use('/register', register);
app.use('/profile-view', profile_view);
app.use('/profile-edit', profile_edit);
app.use('/delete-account', delete_account);

mongoose.connect('mongodb://localhost/initLabDatabase');

passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    users.UserDetails.findOne({
      'username': username,
    }, function(err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }

      if (user.password != password) {
        return done(null, false);
      }

      return done(null, user);
    });
  });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, cb) {
   users.UserDetails.findById(id, function (err, user) {
     if (err) { return cb(err); }
     cb(null, user);
   });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
