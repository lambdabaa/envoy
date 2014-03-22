#!/usr/bin/env node
var express = require('express');

var app = express();
app.use(require('cors')());
app.use('/coverage', require('istanbul-middleware').createHandler());
app.listen(8080);
