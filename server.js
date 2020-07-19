// JavaScript source code
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyparser = require('body-parser');

var app = express();
app.use(bodyparser.json());


app.get('*', (req, res) => {
    console.log(req.url);
    if (req.url === '/') res.sendFile(path.join(`${__dirname}/public/html/index.html`));
    else if (req.url === '/index.html') res.sendFile(path.join(`${__dirname}/public/html/index.html`));
    else if (req.url === '/customerOrderItems.html') res.sendFile(path.join(`${__dirname}/public/html/customerOrderItems.html`));
    else if (req.url === '/customerOrders.html') res.sendFile(path.join(`${__dirname}/public/html/customerOrders.html`));
    else if (req.url === '/customers.html') res.sendFile(path.join(`${__dirname}/public/html/customers.html`));
    else if (req.url === '/employees.html') res.sendFile(path.join(`${__dirname}/public/html/employees.html`));
    else if (req.url === '/newOrder.html') res.sendFile(path.join(`${__dirname}/public/html/newOrder.html`));
    else if (req.url === '/products.html') res.sendFile(path.join(`${__dirname}/public/html/products.html`));
    else if (req.url === '/style.css') res.sendFile(path.join(`${__dirname}/public/css/style.css`));
    else if (req.url === '/mailList.js') res.sendFile(path.join(`${__dirname}/public/js/mailList.js`));
    else if (req.url === '/ElectroniXLogo.jpg') res.sendFile(path.join(`${__dirname}/public/images/ElectroniXLogo.jpg`));
});

app.listen(process.env.port || 3000);

console.log('Running at Port 3000');