var express = require('express');
var pg = require('pg');
var crud = require('express').Router();
var fs = require('fs');

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
 
// Insert condition information for exsiting assets
crud.post('/insertConditionInformation',function(req,res){
    // so the parameters form part of the BODY of the request rather than the RESTful API
    pool.connect(function(err,client,done) {
        if(err){
            console.log("not able to get connection "+ err);
            res.status(400).send(err);
        }
		// request value to perform the SQL query
        var asset_name = req.body.asset_name;
        var condition = req.body.condition;

		// SQL query for inserting condition information
		var querystring = "INSERT into cege0043.asset_condition_information (asset_id, condition_id) values (";
		querystring += "(select id from cege0043.asset_information where asset_name = $1),";
		querystring += "(select id from cege0043.asset_condition_options where condition_description = $2))";

        client.query(querystring, [asset_name, condition],function(err,result) {
                done();
                if(err){
                   console.log(err);
                   res.status(400).send(err);
               }
               res.status(200).send(result.rows);
           });

    });
});

// Insert new asset information functionality
crud.post('/insertAssetPoint',function(req,res){
    // so the parameters form part of the BODY of the request rather than the RESTful API
    pool.connect(function(err,client,done) {
        if(err){
            console.log("not able to get connection "+ err);
            res.status(400).send(err);
        }
		// request value to perform the SQL query
        var AssetName = req.body.AssetName;
        var InstallDate = req.body.InstallDate;
		// SQL query for inserting condition information
        var geometryString = "st_geomfromtext('POINT(" +req.body.longitude +" " + req.body.latitude+")',4326)";
		var querystring = "INSERT into cege0043.asset_information(asset_name,installation_date, location) values ";
		querystring += "($1,$2,";
		querystring += geometryString + ")";


        client.query(querystring, [AssetName,InstallDate],function(err,result) {
                done();
                if(err){
                   console.log(err);
                   res.status(400).send(err);
               }
               res.status(200).send(result.rows);
           });

    });
});
 
 
// Insert new asset information functionality
crud.get('/geoJSONUserId/:user_id',function(req,res){
    // so the parameters form part of the BODY of the request rather than the RESTful API
    pool.connect(function(err,client,done) {
        if(err){
            console.log("not able to get connection "+ err);
            res.status(400).send(err);
        }
		
	   var user_id = req.params.user_id;
       var colnames = "asset_id, asset_name, installation_date, latest_condition_report_date, condition_description";
		
       var querystring = " SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM ";
			querystring = querystring + "(SELECT 'Feature' As type, ST_AsGeoJSON(lg.location)::json As geometry, ";
			querystring = querystring + "row_to_json((SELECT l FROM (SELECT "+ colnames + " ) As l)) As properties";
			querystring = querystring + "   FROM cege0043.asset_with_latest_condition As lg ";
			querystring = querystring + " where user_id = $1 limit 100  ) As f ";


        client.query(querystring,[user_id],function(err,result) {
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