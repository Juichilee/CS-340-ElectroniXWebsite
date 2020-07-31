// JavaScript source code
/*
    Uses express, dbcon for database connection, body parser to parse form data
    handlebars for HTML templates
*/

var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
});

// Setup handlebars, static folder, view engine, and port
app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);

// Place for javascript functions for each page
/*
app.use('/people_certs', require('./people_certs.js'));
app.use('/people', require('./people.js'));
app.use('/planets', require('./planets.js'));
*/
app.use('/customerOrders',require('./customerOrders.js'));

// All static files in public
app.use('/', express.static('public'));

app.get('', function (req, res) {
	res.status(200).render('index', {
		titleText: "Home"
	});
});

// Renders pages in views
app.get('/:page', function (req, res, next) {
	//.toLowerCase();
	var page = req.params.page;
	console.log("Page:", page);
	if (page == "index" || page == '') {
		res.status(200).render('index', {
			titleText: "Home"
		});
	} else if (page == "products") {
		res.status(200).render('products', {
			titleText: "Products"
		});
	} else if (page == "newOrder") {
		res.status(200).render('newOrder', {
			titleText: "New Customer Order"
		});
	} else if (page == "employees") {
		res.status(200).render('employees', {
			titleText: "Employees"
		});
	} else if (page == "customers") {
		res.status(200).render('customers', {
			titleText: "Customers"
		});
	} else if (page == "customerOrders") {
		res.status(200).render('customerOrders', {
			titleText: "Customer Orders"
		});
	} else if (page == "customerOrderItems") {
		res.status(200).render('customerOrderItems', {
			titleText: "Customer Order Items"
		});
	}else {
		next();
	}
});

app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});