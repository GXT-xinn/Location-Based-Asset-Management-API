var express = require('express'); 
 var pg = require('pg'); 
 var geoJSON = require('express').Router(); 
 var fs = require('fs'); 
 
 // get the username - this will ensure that we can use the same code on multiple machines 
 var os = require('os'); 
 const userInfo = os.userInfo(); 
 const username = userInfo.xintguan; 
 console.log(username); 
 // locate the database login details 
 var configtext = ""+fs.readFileSync("/home/xintguan/certs/postGISConnection.js"); 
// now convert the configuration file into the correct format -i.e. a name/value pair array 
 var configarray = configtext.split(","); 
 var config = {}; 
 for (var i = 0; i < configarray.length; i++) { 
 var split = configarray[i].split(':'); 
 config[split[0].trim()] = split[1].trim(); 
 } 
 var pool = new pg.Pool(config); 
 console.log(config);
 
 
 // add a simple test to show the route is working
 geoJSON.route('/testGeoJSON').get(function (req,res) { 
 res.json({message:req.originalUrl}); 
 });
 
 geoJSON.get('/postgistest', function (req,res) { 
 pool.connect(function(err,client,done) { 
 if(err){ 
 console.log("not able to get connection "+ err); 
 res.status(400).send(err); 
 } 
 client.query(' select * from information_schema.columns' ,function(err,result) { 
 done(); 
 if(err){
 console.log(err); 
 res.status(400).send(err); 
 } 
 res.status(200).send(result.rows); 
 }); 
 }); 
 });
 
 // export function so that the route can be published to the dataAPI.js server
 module.exports = geoJSON;