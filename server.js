/*************************************************************************
* BTI325– Assignment 4
* for this assignment, I took the help of my Friend kush while doing assignment
*
* Name: Samarth Modi Student ID: 133357202 Date: 28-10-2022
*
* Your app’s URL (from Cyclic Heroku) that I can click to see your application:
* 
*
*************************************************************************/ 

 //http:localhost:8080
var express = require("express"); // Include express.js module
var app = express();

var dataService = require("./data-service.js");

var path = require("path"); // include moduel path to use __dirname, and function path.join()

const multer = require("multer");

const fs = require('fs');

var exphbs = require('express-handlebars');

app.use(express.static('public'));

var HTTP_PORT = process.env.PORT || 8080;  // || : or



// call this function after the http server starts listening for requests
function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

//part 3
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//P1S1 (part-1 Step1)
app.engine('.hbs',exphbs.engine({extname:'.hbs', defaultLayout: "main",
helpers:
{
    navLink: function(url, options)
    {
        return '<li' + ((url == app.locals.activeRoute) ? ' class="active"' : '')+'><a href=" ' +
        url + ' ">' + options.fn(this) + '</a></li>';
    }, equal: function (lvalue,rvalue,options) 
    {
        if(arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
        if(lvalue != rvalue)
        {
            return options.inverse(this);
        } else 
        {
            return options.fn(this);
        }
    }
    }
}
));

app.set('view engine','.hbs');

/* app.use(bodyParser.urlencoded({extended: true})); */

/* Define a "storage" variable using "multer.diskStorage" */ 
var storage =  multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function(req,file,cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

//FIXING THE NAVIGATION BAR
app.use(function(req,res,next)
{
    let route = req.baseUrl+req.path;
    app.locals.activeRoute = (route == "/" ?"/" :route.replace(/\/$/,""));
    next();
});

//ROUTES
app.get("/",function(req,res)
{
    res.render('home');
})

app.get("/about", function(req,res)
{
    res.render('about');
})

app.get('/employees/add',function(req,res)
{
    res.render('addEmployee');
})

app.get('/images/add',function(req,res)
{
    res.render('addImage');
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

app.post("/employee/update", (req, res) => {
    dataService.updateEmployee(req.body).then((data) =>{
        res.redirect("/employees");
    }).catch(err => res.render({message: "no results"}));
   });




/*Adding "Get" route /images using the "fs" module  */
app.get("/images",function(req,res) 
{
    fs.readdir("./public/images/uploaded", function(err,items)
    {
        for(var a = 0; a < items.length; a++)
        {
            items[a];
        }
        return res.render("images",{images: items});
    })
});

/* Part 4: Adding New Routes to query "Employees" */
app.get("/employees", function(req,res)
{
// route to getEmployeesByDepartment(department)
if(req.query.department){  //if the query string is for department
    dataService.getEmployeesByDepartment(req.query.department).then((data) => {
      res.render("employees",{employees: data})
    }).catch(err => res.render({message: "no results"}));

} else if(req.query.manager){ //if the query string is for manager
    dataService.getEmployeesByManager(req.query.manager).then((data) => {
        res.render("employees",{employees: data})
     }).catch(err => res.render({message: "no results"}));

    } else if(req.query.status){   //if the query string is for status
    dataService.getEmployeesByStatus(req.query.status).then((data) => {
        res.render("employees",{employees: data})
    }).catch(err => res.render({message: "no results"}));

} else if(req.query.employeeNum){   //if the query string is for employeeNum
    dataService.getEmployeeByNum(req.query.employeeNum).then((data) => {
        res.render("employees",{employees: data})
    }).catch(err => res.render({message: "no results"}));

} else{ 
    dataService.getAllEmployees().then((data) => {
        res.render("employees",{employees: data})
    }).catch(err => res.render({message: "no results"}));
}
  });


/*   Add the "/employee/value" route */
app.get("/employee/:employeeNum",function(req,res)
{
    dataService.getEmployeeByNum(req.params.employeeNum).then((data)=>
    {
        res.render("employee",{employee: data});
    }).catch(err => res.render({message: "no result"}));
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
        res.render("departments",{departments: data});
    }).catch(err => res.render({message: "no results"}));
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