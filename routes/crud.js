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
	 client.query(" select user_id from ucfscde.users where user_name = current_user" ,function(err,result) { 
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
               res.status(200).send("Form Data "+ req.body.asset_name+ " has been inserted");
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
               res.status(200).send("Form Data "+ req.body.AssetName+ " has been inserted");
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

// Sum of the reports sumbmitted by user

crud.get('/userConditionReports/:user_id',function(req,res){
    // so the parameters form part of the BODY of the request rather than the RESTful API
    pool.connect(function(err,client,done) {
        if(err){
            console.log("not able to get connection "+ err);
            res.status(400).send(err);
        }
		
	    var user_id = req.params.user_id;
		
        var querystring = " select array_to_json (array_agg(c)) from ";
		    querystring = querystring + "(SELECT COUNT(*) AS num_reports from cege0043.asset_condition_information where user_id = $1) c ";

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


// Tell user their ranking based on the number of report they have submitted in total

crud.get('/userRanking/:user_id',function(req,res){
    // so the parameters form part of the BODY of the request rather than the RESTful API
    pool.connect(function(err,client,done) {
        if(err){
            console.log("not able to get connection "+ err);
            res.status(400).send(err);
        }
		
	    var user_id = req.params.user_id;
		
        var querystring = " select array_to_json (array_agg(hh)) from ";
		    querystring = querystring + "(select c.rank from (SELECT b.user_id, rank()over (order by num_reports desc) as rank  ";
			querystring = querystring + " from (select COUNT(*) AS num_reports, user_id  ";
			querystring = querystring + " from cege0043.asset_condition_information ";
			querystring = querystring + " group by user_id) b) c where c.user_id = $1) hh ";

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



// Show 5 assets closest to the user location

crud.get('/fiveClosestAssets/:latitude/:longitude',function(req,res){
    // so the parameters form part of the BODY of the request rather than the RESTful API
    pool.connect(function(err,client,done) {
        if(err){
            console.log("not able to get connection "+ err);
            res.status(400).send(err);
        }
		
        var querystring = " SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM  ";
		    querystring = querystring + "(SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry,  ";
			querystring = querystring + " row_to_json((SELECT l FROM (SELECT id, asset_name, installation_date) As l )) As properties ";
			querystring = querystring + " FROM   (select c.* from cege0043.asset_information c ";
			querystring = querystring + " inner join (select id, st_distance(a.location, st_geomfromtext('POINT("+req.params.latitude+" "+req.params.longitude+")',4326)) as distance ";
			querystring = querystring + " from cege0043.asset_information a order by distance asc";
			querystring = querystring + " limit 5) b  on c.id = b.id ) as lg) As f";

        client.query(querystring, function(err,result) {
                done();
                if(err){
                   console.log(err);
                   res.status(400).send(err);
               }
               res.status(200).send(result.rows);
           });
    });
});

// showing the last 5 reports created by the user (colour coded depending on the condition value)

crud.get('/lastFiveConditionReports/:user_id',function(req,res){
    // so the parameters form part of the BODY of the request rather than the RESTful API
    pool.connect(function(err,client,done) {
        if(err){
            console.log("not able to get connection "+ err);
            res.status(400).send(err);
        }
		
	    var user_id = req.params.user_id;
		
        var querystring = " SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM   ";
		    querystring = querystring + "(SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry, ";
			querystring = querystring + " row_to_json((SELECT l FROM (SELECT id,user_id, asset_name, condition_description ) As l ";
			querystring = querystring + " )) As properties from ";
			querystring = querystring + " (select * from cege0043.condition_reports_with_text_descriptions where user_id = $1";
			querystring = querystring + " order by timestamp desc limit 5) as lg) As f";
			
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


// shows assets and calculates proximity alerts for assets that the user hasn???t already given a condition report for in the last 3 days

crud.get('/conditionReportMissing/:user_id',function(req,res){
    // so the parameters form part of the BODY of the request rather than the RESTful API
    pool.connect(function(err,client,done) {
        if(err){
            console.log("not able to get connection "+ err);
            res.status(400).send(err);
        }
		
	    var user_id = req.params.user_id;
		
        var querystring = " SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM  ";
		    querystring = querystring + "(SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry, ";
			querystring = querystring + " row_to_json((SELECT l FROM (SELECT asset_id, asset_name, installation_date, latest_condition_report_date, ";
			querystring = querystring + " condition_description) As l )) As properties from";
			querystring = querystring + " (select * from cege0043.asset_with_latest_condition where asset_id not in (";
			querystring = querystring + " select asset_id from cege0043.asset_condition_information where user_id = $1 and ";
			querystring = querystring + "timestamp > NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER-3)  ) as lg) As f ";
			
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

////////////////////////////
// Advance Functionality 2
// List of Assets in Best Condition
crud.get('/assetsInGreatCondition',function(req,res){
    // so the parameters form part of the BODY of the request rather than the RESTful API
    pool.connect(function(err,client,done) {
        if(err){
            console.log("not able to get connection "+ err);
            res.status(400).send(err);
        }

       var querystring = " select array_to_json (array_agg(d)) from (select c.* from cege0043.asset_information c";
			querystring = querystring + " inner join ";
			querystring = querystring + " (select count(*) as best_condition, asset_id from cege0043.asset_condition_information where ";
			querystring = querystring + " condition_id in (select id from cege0043.asset_condition_options where condition_description like '%very good%') ";
			querystring = querystring + " group by asset_id order by best_condition desc) b on b.asset_id = c.id) d";


        client.query(querystring,function(err,result) {
                done();
                if(err){
                   console.log(err);
                   res.status(400).send(err);
               }
               res.status(200).send(result.rows);
           });

    });
});


// Daily report rates

crud.get('/dailyParticipationRates',function(req,res){
    // so the parameters form part of the BODY of the request rather than the RESTful API
    pool.connect(function(err,client,done) {
        if(err){
            console.log("not able to get connection "+ err);
            res.status(400).send(err);
        }

       var querystring = " select  array_to_json (array_agg(c)) from ";
			querystring = querystring + " (select day, sum(reports_submitted) as reports_submitted, sum(not_working) as reports_not_working ";
			querystring = querystring + " from cege0043.report_summary ";
			querystring = querystring + " group by day) c";


        client.query(querystring,function(err,result) {
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