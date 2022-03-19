var express = require('express');
var pg = require('pg');

var crud = require('express').Router();
var fs = require('fs');

// get the username - this will ensure that we can use the same code on multiple machines
var os = require('os');
 const userInfo = os.userInfo();
 const username = userInfo.username; 
 console.log(username); 
 // locate the database login details 
 var configtext = ""+fs.readFileSync("/home/"+username+"/certs/postGISConnection.js");
 // now convert the configruation file into the correct format -i.e. a name/value pair array
var configarray = configtext.split(",");
var config = {};
for (var i = 0; i < configarray.length; i++) {
	var split = configarray[i].split(':');
	config[split[0].trim()] = split[1].trim();
 }
var pool = new pg.Pool(config);
 console.log(config); 
 
const bodyParser = require('body-parser');
crud.use(bodyParser.urlencoded({ extended: true })); 

// test endpoint for GET requests (can be called from a browser URL)
crud.get('/testCRUD',function (req,res) {
	res.json({message:req.originalUrl+" " +"GET REQUEST>"});
	});
   
// Getting user id
crud.get('/getUserId', function (req,res) { 
 pool.connect(function(err,client,done) { 
	 if(err){ 
	 console.log("not able to get connection "+ err); 
	 res.status(400).send(err); 
	 } 
	 client.query(' select user_id from ucfscde.users where user_name = current_user' ,function(err,result) { 
	 done(); 
		 if(err){
		 console.log(err); 
		 res.status(400).send(err); 
		 } 
		res.status(200).send(result.rows); 
		}); 
	}); 
 });   
 
 
 
// test endpoint for POST requests - can only be called from AJAX
crud.post('/testCRUD',function (req,res) {
	console.log("post request" + req.body);
	res.json({message:req.body});
    });
       
module.exports = crud;