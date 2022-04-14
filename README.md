# Asset Condition Assessment API
<a name="top"></a>
A technical guide for developping a simple application server to handle data request for the [Asset Condition Assessment App](https://github.com/ucl-geospatial-21-22/cege0043-apps-21-22-GXT-xinn). This server body is stored in ```dataAPI.js``` file. This RESTful API provides the functionality to interact with the PostgreSQL database, including save, remove, retreive data as GeoJSON file from the database. Funtions 

## Table of Contents

1. [System Requirements](#1)
2. [Deployment](#2)
3. [Testing](#3)
4. [File description](#4)
5. [Code reference & Acknowledgments](#5)

## Getting Started

<a name="1"></a>
### 1. System Requirements

#### Prerequisites

* If you are going to use this api outside the UCL campus (not connected to Eduroam), make sure you are connected to UCL VPN by following the instructions at https://www.ucl.ac.uk/isd/services/get-connected/remote-working-services/ucl-virtualprivate-network-vpn.

* This api requires to make connections to a Ubuntu Server (Virtual Machine). You could use BitVise, Pycharm (Version 2018.3.5 Professional Edition) or other SSH software to connect to the Ubuntu Server.##


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

2. Create a file called ```postGISConnection.js``` to store the user information for database connection, and save the file to ```/home/studentuser/certs``` directory, format like the following:

```
host: XXX,
user: userXXX,
database: ucfscde,
password: cege0052XXXXXX,
port: 5432
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
6. You are expected to receive a message on the webpage smilar to the following:
```
Hello World from the class test server
```

[Go to Top](#top)

<a name="4"></a>
## 4. File description

The files associated to this RESTful API are located in the ```cege0043-api-21-22-GXT-xinn``` folder and its subfolders ```~/routes```.
* ```~/cege0043-api-21-22-GXT-xinn```
	* ```dataAPI.js```: The main html file of this app, through which user could use both Asset Creation App and Condition Assessment App on demand. This file interconnects most resources within the ```~/cege0043-apps-21-22-GXT-xinn```(except the ```~/Build``` and ```dashboard.html```). This file constains several divs and menu links.
		* DIV

		|       id       |    description   |
		|  ------------  |  --------------  |
		|wrapper         |  Hold all divs.  |
		|sidebar         |  Hold the accordion Sidebar and buttons corresponding to their functions.|
		|content-wrapper |  Hold content interconnected to the sidebar buttons. |
		|mapContainer    |  Hold the leaf map.|
		|listContainer   |  Hold D3 table showing a list of assets with least one best condition report. |
		|graphContainer  |  Hold D3 multibar chart showing daily reporting rates for the past week. |
		
		


* ```~/cege0043-api-21-22-GXT-xinn/routes```
	* ```crud.js```:
	
	|       id       |    description   |
	|  ------------  |  --------------  |
	|wrapper         |  Hold all divs.  |
	|sidebar         |  Hold the accordion Sidebar and buttons corresponding to their functions.|
	|content-wrapper |  Hold content interconnected to the sidebar buttons. |
	|mapContainer    |  Hold the leaf map.|
	|listContainer   |  Hold D3 table showing a list of assets with least one best condition report. |
	|graphContainer  |  Hold D3 multibar chart showing daily reporting rates for the past week. |
	


[Go to Top](#top)

<a name="5"></a>
## 5. Code reference & Acknowledgments


* A large proportion of codes are adapted from the lab notes of CEGE 0043 Web Mobile and GIS by Calire Ellul, including
	* Basic structures of ```dataAPI.js``` and ```crud.js```
	* Functions and SQL queries related to data uploading, data removal, data processing, and getting port numbers.
	* Template of the [README.md](https://moodle.ucl.ac.uk/pluginfile.php/2598095/mod_resource/content/1/technical-documentation-example.pdf)

* Template of user guide page is an modified version of [Template Visual](https://github.com/surjithctly/documentation-html-template)'sDocumentation.
* May layers of this app are based on [Leaflet](https://leafletjs.com/).
* The histograms showing daily user participation and table showing a list of all assets with least one 'best-condition' report utilise [D3 JavaScript library](https://d3js.org/d3.v5.min.js).
* The style of markers untilise the [leaflet awesome-markers Javascript](https://cdnjs.cloudflare.com/ajax/libs/Leaflet.awesome-markers/2.0.2/leaflet.awesome-markers.js)
* The README.md file is developed with the help of [Markdown Cheatsheet](https://github.com/tchapi/markdown-cheatsheet/blob/master/README.md#TOP)

[Go to Top](#top)