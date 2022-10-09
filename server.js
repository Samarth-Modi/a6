 /*************************************************************************
* BTI325– Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy. No part * of this assignment has been copied manually or electronically from any
other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Samarth Modi Student ID: 133357202 Date: 08-10-2022
*
* Your app’s URL (from Cyclic) : ______________________________________________
*
*************************************************************************/
 //http:localhost:8080
var express = require("express"); // Include express.js module
var app = express();

var dataService = require("./data-service.js");

var path = require("path"); // include moduel path to use __dirname, and function path.join()

app.use(express.static('public'));

var HTTP_PORT = process.env.PORT || 8080;  // || : or



// call this function after the http server starts listening for requests
function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/",function(req,res)
{
    res.sendFile(path.join(__dirname,"/views/home.html"));
})

app.get("/about", function(req,res)
{
    res.sendFile(path.join(__dirname,"/views/about.html"));
})

app.get("/employees", function(req,res)
{
  dataService.getAllEmployees().then((data) => 
  {
    res.json(data);
  })
})

app.get("/managers",function(req,res)
{
    dataService.getManagers().then((data) => 
    {
        res.json(data);
    })
})

app.get('/departments', function(req,res) 
{
    dataService.getDepartments().then((data) => 
    {
        res.json(data);
    });
});

app.use(function(req,res) 
{
    res.status(404).send('Page Not Found');
});

//app.listen(HTTP_PORT, onHttpStart);

//setup http server to listen on HTTP_PORT
dataService.initialize()
.then(function () 
{
    app.listen(HTTP_PORT, onHttpStart);
})
.catch(function (err) 
{
    console.log('Failed to start!' + err);
})