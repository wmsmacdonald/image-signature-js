'use strict';

const http = require('http');

const express = require('express');
const open = require('open');

let app = express();
app.use(express.static(__dirname + '/public'));

let server = app.listen(8080, (err) => {
    open('http://localhost:8080/test.html');
});
