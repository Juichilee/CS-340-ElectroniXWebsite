-- Query for add a new character functionality with colon : character being used to 
-- denote the variables that will have data from the backend programming language

SELECT * FROM customers;
--excluding the placeholder product we need for a multi-line order to pass foreign-key check
SELECT * FROM products WHERE product_id <> 'PLACE';
SELECT * FROM employees;
SELECT * FROM customer_orders;
SELECT * FROM customer_order_items;
--this is for the search function
SELECT * FROM customer_order_items WHERE order_id = :order_id;

INSERT INTO customers (customer_lastname, customer_firstname, email_addr, phone_nr, street_addr, city_name, state_cd, zip_cd) 
VALUES (:customer_firstname, :customer_lastname, :email_addr, :phone_nr, :street_addr, :city_name, :state_cd, :zip_cd);

INSERT INTO products (product_id, product_description, sale_price, unit_cost) VALUES (:product_id, :product_description, :sale_price, :unit_cost);

INSERT INTO employees (employee_name, start_date, active_flag) VALUES (:employee_name, :start_date, :active_flag);

INSERT INTO customer_orders (order_date, customer_id, employee_id, payment_method) VALUES (:order_date, :customer_id, :employee_id, :payment_method);

INSERT INTO customer_order_items (order_id, product_id, sale_qty) VALUES (:order_id, :product_id, :sale_qty);

--For the multi-line customer order 
--We created a placeholder product so that the foreign key check doesn’t fail when we input a dummy line. 
--Then we can easily delete the dummy line using the WHERE condition.

INSERT INTO customer_orders (order_date, customer_id, employee_id, payment_method) VALUES (:order_date, :customer_id, :employee_id, :payment_method);

INSERT INTO customer_order_items (order_id, product_id, sale_qty) VALUES ((select max(order_id) from customer_orders), :product_id1, :sale_qty1);

INSERT INTO customer_order_items (order_id, product_id, sale_qty) VALUES ((select max(order_id) from customer_orders), :product_id2, :sale_qty2);

DELETE FROM customer_order_items WHERE order_id = (select max(order_id) from customer_order_items) and product_id = 'PLACE' OR sale_qty = 0;
--End Multi-line customer order insert

-- Updating the product_id for an existing product 
UPDATE products SET product_id=:new_product_id, product_description=:product_description, sale_price=:sale_price, unit_cost=:unit_cost WHERE product_id=:product_id;

--Updating the employee_id or payment method of an existing order
UPDATE customer_orders SET employee_id=:new_employee_id, payment_method=:new_payment_method WHERE order_id=:order_id;

--Delete a customer order (and the corresponding child table customer_order_items record)
DELETE FROM customer_order_items WHERE order_id=:order_id;
DELETE FROM customer_orders WHERE order_id:=order_id;


