// JavaScript source code
/*
    Uses express, dbcon for database connection, body parser to parse form data
    handlebars for HTML templates
*/

var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var moment = require('moment');

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
		let sql = "SELECT product_id, product_description, sale_price, unit_cost FROM products WHERE product_id <> 'PLACE'";
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

// DELETE FUNCTIONS


// PAGE INSERTS
app.post('/products/post', function (req, res) {
	let sql = "INSERT INTO products (product_id, product_description, sale_price, unit_cost) VALUES (?,?,?,?)";
	var inserts = [req.body.productIDInput, req.body.productDescriptionInput, parseFloat(req.body.salePriceInput), parseFloat(req.body.unitCostInput)];
	let query = mysql.pool.query(sql, inserts, function (err, results, fields) {
		if (err) {
			console.log(JSON.stringify(err));
			res.write(JSON.stringify(err));
			res.end();
		} else {
			res.redirect('/products');
		}
	});
});

app.post('/customers/post', function (req, res) {
	let sql = "INSERT INTO customers (customer_firstname, customer_lastname, email_addr, phone_nr, street_addr, city_name, state_cd, zip_cd) VALUES (?,?,?,?,?,?,?,?)";
	var inserts = [req.body.firstNameInput, req.body.lastNameInput, req.body.emailAddressInput, req.body.phoneNumberInput, req.body.streetAddress1Input, req.body.cityInput, req.body.stateInput, parseInt(req.body.zipInput)];
	let query = mysql.pool.query(sql, inserts, function (err, results, fields) {
		if (err) {
			console.log(JSON.stringify(err));
			res.write(JSON.stringify(err));
			res.end();
		} else {
			res.redirect('/customers');
        }
	});
});

app.post('/employees/post', function (req, res) {
	let sql = "INSERT INTO employees (employee_name, start_date, active_flag) VALUES (?,?,?)";
	var date = req.body.startDateInput;
	//console.log(date);
	var strDate = date.toString();
	//console.log(strDate);
	var inserts = [req.body.employeeNameInput, strDate, req.body.activeInput];
	let query = mysql.pool.query(sql, inserts, function (err, results, fields) {
		if (err) {
			console.log(JSON.stringify(err));
			res.write(JSON.stringify(err));
			res.end();
		} else {
			res.redirect('/employees');
		}
	});
});

app.post('/customerOrders/post', function (req, res) {
	let sql = "INSERT INTO customer_orders (order_date, customer_id, employee_id, payment_method) VALUES (?,?,?,?)";
	//var date = req.body.orderDateInput;
	//console.log(date);
	//var strDate = date.toString();
	//console.log(strDate);
	var inserts = [req.body.order_date, req.body.customer_id, req.body.employee_id, req.body.payment_method];
	let query = mysql.pool.query(sql, inserts, function (err, results, fields) {
		if (err) {
			console.log(JSON.stringify(err));
			res.write(JSON.stringify(err));
			res.end();
		} else {
			res.redirect('/customerOrders');
		}
	});
});

app.post('/customerOrderItems/post', function (req, res) {
	let sql = "INSERT INTO customer_order_items (order_id, product_id, sale_qty) VALUES (?,?,?)";
	var inserts = [req.body.order_id, req.body.product_id, req.body.sale_qty];
	let query = mysql.pool.query(sql, inserts, function (err, results, fields) {
		if (err) {
			console.log(JSON.stringify(err));
			res.write(JSON.stringify(err));
			res.end();
		} else {
			res.redirect('/customerOrderItems');
		}
	});
});

app.post('/newOrder/post', function (req, res) {
	let sql = "INSERT INTO customer_orders (order_date, customer_id, employee_id, payment_method) VALUES (?,?,?,?);" +
	"INSERT INTO customer_order_items (order_id, product_id, sale_qty) VALUES ((select max(order_id) from customer_orders), ?,?);" +
	"INSERT INTO customer_order_items (order_id, product_id, sale_qty) VALUES ((select max(order_id) from customer_orders), ?,?);" +
	"DELETE FROM customer_order_items WHERE order_id = (select max(order_id) from customer_order_items) and product_id = 'PLACE' OR sale_qty = 0;";
	var inserts = [req.body.order_date, req.body.customer_id, req.body.employee_id, req.body.payment_method, req.body.product_id, req.body.sale_qty,
	req.body.product_id2,req.body.sale_qty2];
	let query = mysql.pool.query(sql, inserts, function (err, results, fields) {
		if (err) {
			console.log(JSON.stringify(err));
			res.write(JSON.stringify(err));
			res.end();
		} else {
			res.redirect('/newOrder');
		}
	});
});

// UPDATE FUNCTIONS
app.post('/products/update', function (req, res) {
	let sql = "UPDATE products SET product_id = ?, product_description = ?, sale_price = ?, unit_cost = ? WHERE product_id = ?";
	//console.log(req.body.product_id + req.body.product_description + req.body.sale_price + req.body.unit_cost + req.body.old_product_id);
	var inserts = [req.body.product_id, req.body.product_description, req.body.sale_price, req.body.unit_cost, req.body.old_product_id];
	let query = mysql.pool.query(sql, inserts, function (err, results, fields) {
		if (err) {
			console.log(JSON.stringify(err));
			res.write(JSON.stringify(err));
			res.end();
		} else {
			res.redirect('/products');
		}
	});
});

app.post('/customerOrders/update', function (req, res) {
	let sql = "UPDATE customer_orders SET employee_id = ?, payment_method = ? WHERE order_id = ?";
	var inserts = [req.body.employee_id, req.body.payment_method, req.body.order_id];
	let query = mysql.pool.query(sql, inserts, function (err, results, fields) {
		if (err) {
			console.log(JSON.stringify(err));
			res.write(JSON.stringify(err));
			res.end();
		} else {
			res.redirect('/customerOrders');
		}
	});
});

//DELETE FUNCTION
app.post('/customerOrders/delete', function (req, res) {
	let sql = "DELETE FROM customer_order_items WHERE order_id = ?;" +
	"DELETE FROM customer_orders WHERE order_id = ?;";
	var inserts = [req.body.order_id, req.body.order_id];
	let query = mysql.pool.query(sql, inserts, function (err, results, fields) {
		if (err) {
			console.log(JSON.stringify(err));
			res.write(JSON.stringify(err));
			res.end();
		} else {
			res.redirect('/customerOrders');
		}
	});
});


// ERROR FUNCTIONS
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
