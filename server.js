/*************************************************************************
* BTI325– Assignment 3
* for this assignment, I took the help of my Friend kush while doing the part-4 from the instruction as I got confused.
other than that I did everything by myself.
*
* Name: Samarth Modi Student ID: 133357202 Date: 28-10-2022
*
* Your app’s URL (from Cyclic Heroku) that I can click to see your application:
* https://whispering-depths-02754.herokuapp.com/
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

//part 3
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/* app.use(bodyParser.urlencoded({extended: true})); */

/* Define a "storage" variable using "multer.diskStorage" */ 
var storage =  multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function(req,file,cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
})



app.get("/",function(req,res)
{
    res.sendFile(path.join(__dirname,"/views/home.html"));
})

app.get("/about", function(req,res)
{
    res.sendFile(path.join(__dirname,"/views/about.html"));
})

app.get('/employees/add',function(req,res)
{
    res.sendFile(path.join(__dirname,"/views/addEmployee.html"))
})

app.get('/images/add',function(req,res)
{
    res.sendFile(path.join(__dirname,"/views/addImage.html"))
})

//Define an "upload" variable as multer({ storage: storage });
const upload = multer({storage: storage});

/* Adding the "Post" route */
app.post("/images/add", upload.single("imageFile"),function(req,res) 
{
    res.redirect("/images");
});

app.post("/employees/add", function(req,res)
{
    dataService.addEmployee(req.body).then((data) => 
    {
        res.redirect("/employees");
    })
})




/*Adding "Get" route /images using the "fs" module  */
app.get("/images",function(req,res) 
{
    fs.readdir("./public/images/uploaded", function(err,items)
    {
        for(var a = 0; a < items.length; a++)
        {
            items[a];
        }
        return res.json({images: items});
    })
})

/* Part 4: Adding New Routes to query "Employees" */
app.get("/employees", function(req,res)
{
// route to getEmployeesByDepartment(department)
if(req.query.department){  //if the query string is for department
    dataService.getEmployeesByDepartment(req.query.department).then((data) => {
      res.json(data);
    });   
} else if(req.query.manager){ //if the query string is for manager
    dataService.getEmployeesByManager(req.query.manager).then((data) => {
          res.json(data);
     });
} else if(req.query.status){   //if the query string is for status
    dataService.getEmployeesByStatus(req.query.status).then((data) => {
      res.json(data);
    });
} else if(req.query.employeeNum){   //if the query string is for employeeNum
    dataService.getEmployeeByNum(req.query.employeeNum).then((data) => {
         res.json(data);
    });
} else{ 
    dataService.getAllEmployees().then((data) => {
          res.json(data);
    });
}
  });


/*   Add the "/employee/value" route */
app.get("/employee/:employeeNum",function(req,res)
{
    dataService.getEmployeeByNum(req.params.employeeNum).then((data)=>
    {
        res.json(data);
    });
});

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