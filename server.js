/*************************************************************************
* BTI325– Assignment 5
* for this assignment, I took the help of my Friend kush while doing the assignment.
*
* Name: Samarth Modi Student ID: 133357202 Date: 27-11-2022
*
* Your app’s URL (from Cyclic Heroku) that I can click to see your application:
* https://dead-cyan-millipede-tutu.cyclic.app/
*************************************************************************/ 

 //http:localhost:8080
var express = require("express"); // Include express.js module
var app = express();

var dataService = require("./data-service.js");

var path = require("path"); // include moduel path to use __dirname, and function path.join()

const multer = require("multer");

var bodyParser = require('body-parser');

const fs = require('fs');

var exphbs = require('express-handlebars');

app.use(express.static('public'));

var HTTP_PORT = process.env.PORT || 8080;  // || : or



// call this function after the http server starts listening for requests
function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

//part 3 to handle form data
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//P1S1 (part-1 Step1)
app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: "main",
runtimeOptions: {
  
    allowProtoPropertiesByDefault: true,
  
    allowProtoMethodsByDefault: true,
  
},
helpers:{
  navLink: function(url, options){ 
  return '<li' +  
      ((url == app.locals.activeRoute) ? ' class="active" ' : '') +  
      '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>'; 
}, equal: function (lvalue, rvalue, options) { 
  if (arguments.length < 3) 
      throw new Error("Handlebars Helper equal needs 2 parameters"); 
  if (lvalue != rvalue) { 
      return options.inverse(this); 
  } else { 
      return options.fn(this); 
  } 
}
}
}));

app.set('view engine','.hbs');

/* app.use(bodyParser.urlencoded({extended: true})); */

/* Define a "storage" variable using "multer.diskStorage" */ 
var storage =  multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function(req,file,cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

app.use(express.static('public'));

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
    dataService.getDepartments().then((data)=>{
        res.render("addEmployee", {departments:data});
    }).catch((err)=>{
        res.render("addEmployee",{departments:[]});
    });
  
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
    dataService.addEmployee(req.body).then(() => 
    {
        res.redirect("/employees");
    })
})

app.post("/employee/update", (req, res) => {
    dataService.updateEmployee(req.body).then(() =>{
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
    dataService.getEmployeesByDepartment(req.query.department).then((dataService) => {
      res.render("employees",dataService.length>0?{employees:dataService}:{message:"No results"});

    }).catch(err => res.render({message: "no results"}));

} else if(req.query.manager){ //if the query string is for manager
    dataService.getEmployeesByManager(req.query.manager).then((dataService) => {
        res.render("employees",dataService.length>0?{employees:dataService}:{message:"No results"});

     }).catch(err => res.render({message: "no results"}));

    } else if(req.query.status){   //if the query string is for status
    dataService.getEmployeesByStatus(req.query.status).then((dataService) => {
        res.render("employees",dataService.length>0?{employees:dataService}:{message:"No results"});
    }).catch(err => res.render({message: "no results"}));

} else if(req.query.employeeNum){   //if the query string is for employeeNum
    dataService.getEmployeeByNum(req.query.employeeNum).then((dataService) => {
        res.render("employees",dataService.length>0?{employees:dataService}:{message:"No results"});
    }).catch(err => res.render({message: "no results"}));

} else{ 
    dataService.getAllEmployees().then((dataService) => {
        res.render("employees",dataService.length>0?{employees:dataService}:{message:"No results"});
    }).catch(err => res.render({message: "no results"}));
}
  });


/*   Add the "/employee/value" route */
/* app.get("/employee/:employeeNum",function(req,res)
{
    dataService.getEmployeeByNum(req.params.employeeNum).then((data)=>
    {
        res.render("employee",{employee: data});
    }).catch(err => res.render({message: "no result"}));
}); */

app.get("/employee/:empNum", (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    dataService.getEmployeeByNum(req.params.empNum).then((data) => {
    if (data) {
    viewData.employee = data; //store employee data in the "viewData" object as "employee"
    } else {
    viewData.employee = null; // set employee to null if none were returned
    }
    }).catch(() => {
    viewData.employee = null; // set employee to null if there was an error
    }).then(dataService.getDepartments)
    .then((data) => {
    viewData.departments = data; // store department data in the "viewData" object as
    "departments"
    // loop through viewData.departments and once we have found the departmentId that matches
    // the employee's "department" value, add a "selected" property to the matching
    // viewData.departments object
    for (let i = 0; i < viewData.departments.length; i++) {
    if (viewData.departments[i].departmentId == viewData.employee.department) {
    viewData.departments[i].selected = true;
    }
    }
    }).catch(() => {
    viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
    if (viewData.employee == null) { // if no employee - return an error
    res.status(404).send("Employee Not Found");
    } else {
    res.render("employee", { viewData: viewData }); // render the "employee" view
    }
    });
    });
  
app.get("/employees/delete/:empNum",(req,res)=>{
    dataService.deleteEmployeeByNum(req.params.empNum).then(()=>{
       res.redirect("/employees");
    }).catch((err)=>{
        res.status(400).send("Unable to Remove Employee / Employee not found")
    });
});
    

app.get("/managers",function(req,res)
{
    dataService.getManagers().then((dataService) => 
    {
        res.render("departments",dataService.length>0?{departments:dataService}:{message:"No results."})

    })
})

app.get("/departments/add",(req,res)=>
{
    res.render("addDepartment");
})



app.post("/departments/add",(req,res)=>
{
    dataService.addDepartment(req.body).then(()=>
    {
        res.redirect("/departments");
    }).catch((err)=>
    {
        res.status(500).send("Unable to update the department.");
    })
})


app.get('/departments', function(req,res) 
{
    dataService.getDepartments().then((dataService) => 
    {
        res.render("departments",{departments: dataService});
    }).catch(err => res.render({message: "no results"}));
});

app.post("/department/update",(req,res)=>
{
    dataService.updateDepartment(req.body).then(()=>
    {
        res.redirect("/departments");
    }).catch((err)=>
    {
        res.status(500).send("Unable to update the department.");
    })
})

app.get("/department/:departmentId",(req,res)=>{
    dataService.getDepartmentById(req.params.departmentId).then((data)=>{
        if (!data)
            {res.status(404).send("Department not found");}
        else
            {res.render("department",{department:data});}
    }).catch((err)=>{
        res.status(404).send("Department not found.");
    })
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