const express = require('express');
const http = require('http');
const app = express();	
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan  = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

mongoose.connect('mongodb://localhost:27017/auth');
// mongoose.connect(process.env.MONGOLAB_URI);


// app setup
app.use(cookieParser()); // read cookies (needed for auth)
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json 
app.use(bodyParser.json())
app.use('/controllers', express.static(process.cwd() + './app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));


app.set('view engine', 'pug'); // set up pug for templating
app.set('views', './app/views');


// required for passport
app.use(session({ secret: 'letsdance' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./app/routes/studentRoute')(app, passport);
require('./app/services/passport')(passport); // pass passport for configuration
//render 404 on missing routes
app.get('*', function(req, res){
  res.render('error400');
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error500', {
        error: err
    });
  });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        error: ''
    });
});


// server setup
const port = process.env.PORT || 8000;
app.listen( port, function(){
	console.log('app running on port: '+port);
});