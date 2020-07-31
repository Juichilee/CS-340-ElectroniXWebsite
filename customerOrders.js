//select * to get all current data in table

app.get('/',function(req,res){
	let sql = "SELECT * FROM customer_orders";
	let query = conn.query(sql, function(err, results){
		if(err) throw err;
		res.render('customerOrders',{
			results: results
		});
	});
});