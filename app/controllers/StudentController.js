'use strict';
var Student = require('../model/Student.js');
var Question = require('../model/Question.js');

var StudentController = function(){


	// this.giveExam = function(req, res){
	// 	const examcode = req.user.examcode;
	// 	Question.find({'ofExam': req.user.examcode}, function (err, docs) {
	// 		if (err) { return next(err); }
	// 		res.render('exam/giveexam',{
	// 			'questions': docs
	// 		});
	// 	});
	// };

};

module.exports = StudentController;