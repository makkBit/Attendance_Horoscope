/*******************************
********** STUDENT ROUTES*********
*******************************/
const passportService = require('../services/studentPassport');
const passport = require('passport');
const moment = require('moment');
var StudentController = require('../controllers/StudentController');
var studentController = new StudentController();


module.exports = function(app, passport){

    app.get('/', function (req, res) {
        res.render('home/index');
    });

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

    app.get('/studentdashboard', isSignedIn, function (req, res) {
        var fomatted_date = moment(req.user.dob).format('DD-MM-YYYY');

        res.render('student/studentdashboard', {
            email: req.user.email,
            name: req.user.name,
            fathername: req.user.fathername,
            dob: fomatted_date,
            examcode: req.user.examcode
        });
    });

    app.get('/studentlogout', isSignedIn, function (req, res) {
        req.logout();
        res.redirect('/studentsignin');
    });

    app.get('/stats', isSignedIn, function (req, res) {
        res.render('student/stats');
    });
    

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