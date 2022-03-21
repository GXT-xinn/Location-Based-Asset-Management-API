// express is the server that forms part of the nodejs program
var express = require('express');
var path = require("path");
var fs = require('fs');
var http = require('http');
var app = express();
var httpServer = http.createServer(app);

httpServer.listen(4480);

app.get('/',function (req,res) {
	res.send("Hello World from the class test server");
});

// adding functionality to allow cross-origin queries when PhoneGap is running a server 
app.use(function(req, res, next) { 
 res.setHeader("Access-Control-Allow-Origin", "*"); 
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
 res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); 
 next(); 
});

// adding functionality to log the requests 
 app.use(function (req, res, next) { 
 var filename = path.basename(req.url); 
 var extension = path.extname(filename); 
 console.log("The file " + filename + " was requested."); 
 next(); 
});

const geoJSON = require('./routes/geoJSON'); 
app.use('/', geoJSON);

const crud = require('./routes/crud');
app.use('/', crud); 