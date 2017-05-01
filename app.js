'use strict';

const express = require('express');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const db = require('./models').db;
const routes = require('./routes');

const app = express();

app.use(morgan('dev'));

app.set('view engine', 'html'); // have res.render work with html files
app.engine('html', nunjucks.render); // when giving html files to res.render, tell it to use nunjucks
nunjucks.configure('views', {noCache: true}); // point nunjucks to the proper directory for templates

app.use('/', routes);

db.sync({force: true})
.then(function() {
    app.listen(3000, function() {
        console.log('Server is listening to port 3000');
    });
})
.catch(console.error);