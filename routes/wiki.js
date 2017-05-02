'use strict';

const router = require('express').Router();
let models = require('../models');
let Page = models.Page; 
let User = models.User; 

// GET /wiki
router.get('/', function(req, res, next){
	Page.findAll({})
	.then(function(pagesFound) {
		res.render('index', {pages: pagesFound});
	})
	.catch(next);
});

// GET /wiki/add
router.get('/add', function(req, res, next){
	res.render('addpage');
});

// GET /wiki/JavaScript
router.get('/:urlTitle', function(req, res, next) {
  console.log('GET urlTitle - urlTitle: ', req.params.urlTitle);
  Page.findOne({
	  where: {
		  urlTitle: req.params.urlTitle
	  }
  })
  .then(function(pageFound) {
		if (!pageFound) {
			let err = new Error('urlTitle cannot be found');
			err.status = 404;
			throw err;
		}
	  res.render('wikipage', { page: pageFound });
  })
  .catch(next);
})

router.post('/', function(req, res, next) {
	User.findOrCreate({
		where: {
			email: req.body.authorEmail,
			name: req.body.authorName
		}
	})
	.spread(function(user, wasCreated) { // returns [pageThatWasFoundOrCreated, createdBoolean]
		Page.create(req.body)
		.then(function(createdPage) {
			createdPage.setAuthor(user);
		  res.status(200).json(createdPage); //.setStatus(200).json(createdPage); //return createdPage.setAuthor(user); // sets Pages.authorId
		})
		.catch(err => next(err));// catch & send to error middleware - one way...    
	})
	.catch(next); // catch & send to error middleware - another way...
});

module.exports = router;