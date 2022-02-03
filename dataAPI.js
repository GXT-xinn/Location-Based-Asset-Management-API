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
