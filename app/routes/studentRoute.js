/*******************************
********** STUDENT ROUTES*********
*******************************/
const passportService = require('../services/studentPassport');
const passport = require('passport');
const moment = require('moment');
var StudentController = require('../controllers/StudentController');
var studentController = new StudentController();


module.exports = function(app, passport){

    app.route('/studentsignin')
    	.get(function(req, res) {
            if (req.isAuthenticated())
                res.redirect('/studentdashboard');
            res.render('student/studentsignin', {
                message: req.flash('loginMessage')
            });
        })
        .post(passport.authenticate('student-signin', 
            {
                successRedirect: 'studentdashboard',
                failureRedirect: 'studentsignin',
                failureFlash: true
            }
        ));

    app.post('/studentsignup', passport.authenticate('student-signup', 
        {
            successRedirect: 'studentdashboard',
            failureRedirect: 'studentsignin',
            failureFlash: true
        }
    ));
    

    // route middleware to make sure a user is logged in
    function isSignedIn(req, res, next) {
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();
        // if they aren't, redirect them to the login
        res.redirect('/studentsignin');
    }

    function getDate(dateiso){
        
    }


};