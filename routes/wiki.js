'use strict';

const router = require('express').Router();
let models = require('../models');
let Page = models.Page; 
let User = models.User; 

router.get('/', function(req, res, next){
	res.redirect('/');
});

router.get('/add', function(req, res, next){
	res.render('addpage');
});

router.post('/', function(req, res, next){
	let title = req.body.title;
	let content = req.body.content;

	Page.create({
		title: title,
		content: content
	})
    .then(function(page) {
	  res.json(page);
	})
	.catch(console.err);
});

module.exports = router;