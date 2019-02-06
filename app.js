var express = require('express');
var sampleHWRouter = require('./controllers/sampleHWRouter');
const app = express();
const db = require('./model/oracleDB');

app.use('/elnpoc',sampleHWRouter);
var port = 3000;

app.listen(port);
console.log('Application started on port ' + port);