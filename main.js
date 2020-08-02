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
//app.use('/customerOrders',require('./customerOrders.js'));

app.get('/',function(req,res){
	res.status(200).render('index', {
		titleText: "Home"
	});
});

// All static files in public
app.use('/', express.static('public'));

app.get('', function (req, res) {
	res.status(200).render('index', {
		titleText: "Home"
	});
});

// Renders pages in views and their tables via SELECT
app.get('/:page', function (req, res, next) {
	//.toLowerCase();
	var page = req.params.page;
	console.log("Page:", page);
	if (page == "index" || page == '') {
		res.status(200).render('index', {
			titleText: "Home"
		});
	} else if (page == "products") {
		let sql = "SELECT product_id, product_description, sale_price, unit_cost FROM products";
		let query = mysql.pool.query(sql, function (err, results) {
			if (err) throw err;
			res.status(200).render('products', {
				titleText: "Products",
				results: results
			});
		});
		
	} else if (page == "newOrder") {
		res.status(200).render('newOrder', {
			titleText: "New Customer Order"
		});
	} else if (page == "employees") {
		let sql = "SELECT employee_id, employee_name, DATE_FORMAT(start_date, '%m-%d-%Y') as start_date, active_flag FROM employees";
		let query = mysql.pool.query(sql, function (err, results) {
			if (err) throw err;
			res.status(200).render('employees', {
				titleText: "Employees",
				results: results
			});
		});
		
	} else if (page == "customers") {
		let sql = "SELECT customer_id, customer_firstname, customer_lastname, email_addr, phone_nr, street_addr, city_name, state_cd, zip_cd FROM customers";
		let query = mysql.pool.query(sql, function (err, results) {
			if (err) throw err;
			res.status(200).render('customers', {
				titleText: "Customers",
				results: results
			});
		});
	} else if (page == "customerOrders") {
		let sql = "SELECT order_id, DATE_FORMAT(order_date, '%m-%d-%Y') as order_date, customer_id, employee_id, payment_method FROM customer_orders";
		let query = mysql.pool.query(sql, function (err, results) {
			if (err) throw err;
			res.render('customerOrders', {
				titleText: "CustomerOrders",
				results: results
			});
		});
	} else if (page == "customerOrderItems") {
		let sql = "SELECT order_id, product_id, sale_qty FROM customer_order_items";
		let query = mysql.pool.query(sql, function (err, results) {
			if (err) throw err;
			res.status(200).render('customerOrderItems', {
				titleText: "Customer Order Items",
				results: results
			});
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