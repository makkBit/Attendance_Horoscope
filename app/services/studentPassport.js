var LocalStrategy   = require('passport-local').Strategy;
var Student = require('../model/Student');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        Student.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================

    passport.use('student-local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        Student.findOne({ 'email' : email }, function(err, user) {
            // if there are any errors, return the error
            if(err) { return next(err); }

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                const newStudent = new Student();

                // set the user's local credentials
                newStudent.email    = email;
                newStudent.password = newStudent.generateHash(password);
                newStudent.name = name;
                newStudent.fathername = fathername;
                newStudent.dob = dob;
                newStudent.examcode = examcode;

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
    // LOCAL SIGNIN ============================================================
    // =========================================================================
    passport.use('student-local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
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

