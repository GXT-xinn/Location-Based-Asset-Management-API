# Asset Condition Assessment API
<a name="top"></a>
A technical guide for developping a simple application server to handle data request for the [Asset Condition Assessment App](https://github.com/ucl-geospatial-21-22/cege0043-apps-21-22-GXT-xinn). This server body is stored in ```dataAPI.js``` file. This RESTful API provides the functionality to interact with the PostgreSQL database, including save, remove, retreive data as GeoJSON file from the database and return confirm receipts when interaction completed. Funtions to support those interactions are stored separatly in the ```crud.js``` file for debugging purpose. 

## Table of Contents

1. [System Requirements](#1)
2. [Deployment](#2)
3. [Testing](#3)
4. [File description](#4)
5. [Examples: Testing Results] (#5)
6. [Acknowledgments](#6)

## Getting Started

<a name="1"></a>
### 1. System Requirements

#### Prerequisites

* If you are going to use this api outside the UCL campus (not connected to Eduroam), make sure you are connected to UCL VPN by following the instructions at https://www.ucl.ac.uk/isd/services/get-connected/remote-working-services/ucl-virtualprivate-network-vpn.

* This api requires to make connections to a Ubuntu Server (Virtual Machine). You could use BitVise, Pycharm (Version 2018.3.5 Professional Edition) or other SSH software to connect to the Ubuntu Server.


#### External Libraries

* NPM express package
* PG package

[Go to Top](#top)

<a name="2"></a>
### 2. Deployment

* **Procedures to deploy this application server**:

1. Clone the source code of this api from Github to CEGE server at ```home/studentuser/code``` by typing in the command line (terminal) window for Ubuntu: 

```
$ cd /home/studentuser/code
$ git clone https://github.com/ucl-geospatial-21-22/cege0043-api-21-22-GXT-xinn.git
```

2. Create a file called ```postGISConnection.js``` to store the user information for database connection, and save the file to ```/home/studentuser/certs``` directory, **which you will need to create the folder first**, format like the following:

```
host: *XXX*,
user: *userXXX*,
database: *ucfscde*,
password: *cege0052XXXXXX*,
port: *5432*
```

3. Download and install the Node.js

```
$ cd /home/studentuser/code/cege0043-api-21-22-GXT-xinn
$ npm install express
```

4. Download and install the pg packages

```
$ cd /home/studentuser/code/cege0043-api-21-22-GXT-xinn
$ npm install pg -save
```


5. Make sure the Node JS server is successfully started. If any error occurs, you could enter the debug mode through the command line window by typing

```
$ cd /home/studentuser/code/cege0043-api-21-22-GXT-xinn
$ node dataAPI.js
```


[Go to Top](#top)


<a name="3"></a>
### 3. Testing

* ***Procedures to test this app***:

1. Make sure your device is connected to UCL Wifi or UCL VPN.
2. Make sure the Node JS server is installed and active.
5. In a browser, like Chrome or Firefox, type the following address to test the functionality of the API:
```
https://cege0043-2022-45.cs.ucl.ac.uk/api
```
6. You are expected to receive a smilar message on the webpage to the following:
```
Hello World from the class test server
```

[Go to Top](#top)

<a name="4"></a>
## 4. File description

The files associated to this RESTful API are located in the ```cege0043-api-21-22-GXT-xinn``` folder and its subfolders ```~/routes```.
* ```~/cege0043-api-21-22-GXT-xinn```
	* ```dataAPI.js```: This file 
	- references the packages and codes
	```
	var express = require('express');
	var path = require("path");
	var fs = require('fs');
	var http = require('http');
	var app = express();
	var httpServer = http.createServer(app);
	```
	- Assigns 4480 aa the listening port
	```
	httpServer.listen(4480);
	```
	- Return designated message when receives root level request
	```
	app.get('/',function (req,res) {
		res.send("Hello World from the class test server");
	});
	```
	- Function to support CROSS ORIGIN (CORS) requests
	```
	app.use(function(req, res, next) { 
		res.setHeader("Access-Control-Allow-Origin", "*"); 
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
		res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); 
		next(); 
	});
	```
	- Function to log the CROSS ORIGIN requests in the linux server for debugging 
	```
	app.use(function (req, res, next) { 
		var filename = path.basename(req.url); 
		var extension = path.extname(filename); 
		console.log("The file " + filename + " was requested."); 
		next(); 
	});
	```
	- Registers ```crud.js``` file in order to use the funtionalies included
	```
	const crud = require('./routes/crud');
	app.use('/', crud);
	```
		


	* ```~/routes```
		* ```crud.js```:  CRUD stands for Create, Read, Update, Delete as to explicily describe the main funtionality of this files.
		
			* Locate the database login information:
			While the database login information was created and stored in the ```/home/studentuser/certs/postGISConnection.js``` as required in the deployment section.
			Details in the configruation file will be converted into the pair array format to successfully connnect to the database.
			
			* 
			
			* Functions to interact with database
		
			|       function  					|    description   |
			|  -------------------------------- |  --------------  |
			|~/getUserId         				|  Hold all divs.  |
			|~/insertConditionInformation       |  Hold all divs.  |
			|~/insertAssetPoint         		|  Hold all divs.  |
			|~/geoJSONUserId/:user_id         	|  Hold all divs.  |
			|~/userConditionReports/:user_id    |  Hold all divs.  |
			|~/userRanking/:user_id         	|  Hold all divs.  |
			|~/fiveClosestAssets/:latitude/:longitude  |  Hold all divs.  |
			|~/lastFiveConditionReports/:user_id       |  Hold all divs.  |
			|~/conditionReportMissing/:user_id         |  Hold all divs.  |
			|~/assetsInGreatCondition         	|  Hold all divs.  |
			|~/dailyParticipationRates         	|  Hold all divs.  |

[Go to Top](#top)


<a name="3"></a>
### 3. Testing

* ***Procedures to test this app***:

1. Make sure your device is connected to UCL Wifi or UCL VPN.
2. Make sure the Node JS server is installed and active.
5. In a browser, like Chrome or Firefox, type the following address to test the functionality of the API:
```
https://cege0043-2022-45.cs.ucl.ac.uk/api
```
6. You are expected to receive a message on the webpage smilar to the following:
```
Hello World from the class test server
```

[Go to Top](#top)


<a name="6"></a>
## 6. Acknowledgments


* A large proportion of codes are adapted from the lab notes of CEGE 0043 Web Mobile and GIS by Calire Ellul, including
	* Basic structures of ```dataAPI.js``` and ```crud.js```
	* Functions and SQL queries related to data uploading, data removal, data processing, database connection, and getting the port number.
	* Template of the [README.md](https://moodle.ucl.ac.uk/pluginfile.php/2598095/mod_resource/content/1/technical-documentation-example.pdf)

* npm express package
* pg package
* The README.md file is developed with the help of [Markdown Cheatsheet](https://github.com/tchapi/markdown-cheatsheet/blob/master/README.md#TOP)

[Go to Top](#top)