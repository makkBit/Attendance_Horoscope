var LocalStrategy   = require('passport-local').Strategy;
var Student = require('../model/Student');

// expose this function to our app using module.exports
module.exports = function(passport) {

    passport.serializeUser(function (user, done) {
        done(null, JSON.stringify(user));
    });

    passport.deserializeUser(function (user, done) {
        done(null, JSON.parse(user));
    });


    // =========================================================================
    // STUDENT SIGNUP ============================================================
    // =========================================================================
    passport.use('student-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            Student.findOne({ 'email' : email }, function(err, user) {
                // if there are any errors, return the error
                if(err) { return next(err); }

                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {

                    const newStudent = new Student();

                    // set the user's local credentials
                    newStudent.email    = email;
                    newStudent.password = newStudent.generateHash(password);
                    newStudent.name = req.body.name;
                    newStudent.fathername = req.body.fathername;
                    newStudent.dob = req.body.dob;
                    newStudent.examcode = req.body.examcode;

                    // save the user
                    newStudent.save(function(err) {
                        if(err) { return next(err); }
                        return done(null, newStudent);
                    });
                }
            });    
        });
    }));

    // =========================================================================
    // STUDENT LOGIN ============================================================
    // =========================================================================
    passport.use('student-signin', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form
           
            Student.findOne({ 'email' :  email }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); 
                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                // all is well, return successful user
                return done(null, user);
            });
    }));




};

