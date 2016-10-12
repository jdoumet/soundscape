var express = require('express');
var bodyParser= require('body-parser');
var cors = require('cors');
var path = require('path');
var fs = require('fs');
var http = require ('http');         // For serving a basic web page.
var mongoose = require ("mongoose"); // The reason for this demo.

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));

//app.get('/', function(req, res) {
//    // res.sendFile(path.join(__dirname, '/public', 'index.html'));
//    res.sendFile('index.html', { root: path.join(__dirname, 'public') });
//});

var uristring =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://rudolf:pass1234@ds019906.mlab.com:19906/soundscape';

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, {promiseLibrary: require('bluebird')}, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connection to: ' + uristring);
    }
});


var api = require('./api.js');

app.post('/save', api.save);
app.get('/get/:id', api.get);
app.get('/list', api.list);
app.post('/update', api.update);
app.get('/statistics', api.statistics);
app.get('/charts', api.charts);

app.get('/quiz', function(req, res){
    res.sendFile('1.html', { root: path.join(__dirname, 'public') });
});

var port = process.env.PORT || 8081;

app.listen(port, function() {
    console.log('listening on 8081');
});