var LocalStrategy   = require('passport-local').Strategy;
var Admin = require('../model/Admin');
var Student = require('../model/Student');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================

    // used to serialize the user for the session
    // passport.serializeUser(function(user, done) {
    //     done(null, user.id);
    // });


    // passport.deserializeUser(function(user, done) {            
    //   if (isAdmin(user)) {
    //     Admin.findById(id, function(err, user) {
    //         done(err, user);
    //     });
    //   } 
    //   else if (isStudent(user)) {
    //     Student.findById(id, function(err, user) {
    //         done(err, user);
    //     });
    //   }
    // });

    //used to deserialize the user
    // passport.deserializeUser(function(id, done) {
    //     Admin.findById(id, function(err, user) {
    //         done(err, user);
    //     });
    // });

    passport.serializeUser(function (user, done) {
        done(null, JSON.stringify(user));
    });

    passport.deserializeUser(function (user, done) {
        done(null, JSON.parse(user));
    });


    // =========================================================================
    // ADMIN SIGNUP ============================================================
    // =========================================================================
    passport.use('admin-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        Admin.findOne({ 'email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if(err) { return next(err); }

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                const newAdmin = new Admin();

                // set the user's local credentials
                newAdmin.email    = email;
                newAdmin.password = newAdmin.generateHash(password);

                // save the user
                newAdmin.save(function(err) {
                    if(err) { return next(err); }
                    return done(null, newAdmin);
                });
            }

        });    

        });

    }));

    // =========================================================================
    // ADMIN SIGNIN ============================================================
    // =========================================================================
    passport.use('admin-signin', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form
            Admin.findOne({ 'email' :  email }, function(err, user) {
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

