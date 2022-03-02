var express = require('express');
var pg = require('pg');

var crud = require('express').Router();
var fs = require('fs');

// get the username - this will ensure that we can use the same code on multiple machines
var os = require('os');
 const userInfo = os.userInfo();
 const username = userInfo.xintguan;
 console.log(username);
 // locate the database login details
var configtext = ""+fs.readFileSync("/home/"+xintguan+"/certs/postGISConnection.js"); 
 // now convert the configruation file into the correct format -i.e. a name/value pair array
var configarray = configtext.split(",");
var config = {};
for (var i = 0; i < configarray.length; i++) {
	var split = configarray[i].split(':');
	config[split[0].trim()] = split[1].trim();
 }
var pool = new pg.Pool(config);
 console.log(config); 
 