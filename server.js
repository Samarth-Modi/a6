 /*************************************************************************
* BTI325– Assignment 3
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy. No part * of this assignment has been copied manually or electronically from any
other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Samarth Modi Student ID: 133357202 Date: 08-10-2022
*
* Your app’s URL (from Cyclic) : https://joyous-tuxedo-bee.cyclic.app/
*
*************************************************************************/
 //http:localhost:8080
var express = require("express"); // Include express.js module
var app = express();

var dataService = require("./data-service.js");

var path = require("path"); // include moduel path to use __dirname, and function path.join()

const multer = require("multer");

const fs = require('fs');

app.use(express.static('public'));

var HTTP_PORT = process.env.PORT || 8080;  // || : or



// call this function after the http server starts listening for requests
function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(bodyParser.urlencoded({extended: true}));

/* Define a "storage" variable using "multer.diskStorage" */ 
var storage =  multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function(req,res,cb){
        cb(null, Date.now() + path.extreme(file.originalname));
    }
})

//Define an "upload" variable as multer({ storage: storage });
 const upload = multer({storage: storage});

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

app.get('/employees/add',function(req,res)
{
    res.sendFile(path.join(__dirname,"/views/addEmployee.html"))
})

app.get('/images/add',function(req,res)
{
    res.sendFile(path.join(__dirname,"/views/addImage.html"))
})

app.use(function(req,res) 
{
    res.status(404).send('Page Not Found');
});

/* Adding the "Post" route */
app.post("images/add", upload.single("imageFile"),(req,res) => 
{
    res.redirect("/images");
});

/*Adding "Get" route /images using the "fs" module  */
app.get("/images",function(req,res) 
{
    fs.readdir("./public/images/uploaded", function(err,items)
    {
        for(var a = 0; a < items.length; ++i)
        {
            items[i];
        }
        return res.json({images: items});
    })
})


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