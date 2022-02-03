// express is the server that forms part of the nodejs program 
var express = require('express'); 
var path = require("path"); 
var app = express(); 
var fs = require('fs'); 
// add an https server to serve files 
var http = require('http'); 
var httpServer = http.createServer(app); 
httpsServer.listen(4480); 
app.get('/',function (req,res) { 
 res.send("hello world from the Data API"); 
});
