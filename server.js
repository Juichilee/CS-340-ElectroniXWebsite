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
});

app.listen(process.env.port || 3000);

console.log('Running at Port 3000');