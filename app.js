'use strict';

const express = require('express');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const db = require('./models').db;
const routes = require('./routes');

const app = express();

app.use(morgan('dev')); // logging

app.engine('html', nunjucks.render); // when giving html files to res.render, tell it to use nunjucks
nunjucks.configure('views', { noCache: true }); // point nunjucks to the proper directory for templates
app.set('view engine', 'html'); // allows res.render to work with html files

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// can access static files: 
app.use(express.static(__dirname + '/node_modules')); // within /node_modules
app.use(express.static(__dirname + '/public'));       // within /public

app.use('/', routes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || "Internal Error");
})

db.sync()// db.sync({force: true}) // force: true -> drop tables if exist and re-create
.then(() => {
    app.listen(3000, function() {
        console.log('Server is listening to port 3000');
    });
})
.catch(console.error);
