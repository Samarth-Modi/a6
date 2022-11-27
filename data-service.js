/*************************************************************************
* BTI325– Assignment 3
* for this assignment, I took the help of my Friend kush while assignment.
other than that I did everything by myself.
*
* Name: Samarth Modi Student ID: 133357202 Date: 12-11-2022
*
* Your app’s URL (from Cyclic Heroku) that I can click to see your application:
* https://whispering-depths-02754.herokuapp.com/
*
*************************************************************************/ 
const fs = require('fs');
const { resolve } = require('path');
let employees = [];
let departments = [];



const Sequelize = require('sequelize');

var sequelize = new Sequelize('qhkwwiov', 'qhkwwiov', 'YoyMzqgBD8PnGa0gJgvccPlQwBe3WwKN', {
    host: 'heffalump.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: 
    {
        require:true,
        rejectUnauthorized: false
    }}, 
   });


   sequelize
   .authenticate()
   .then(function() {
       console.log('Connection has been established successfully.');
   })
   .catch(function(err) {
       console.log('Unable to connect to the database:', err);
   });

   //Creating Data Models

   var Employee = sequelize.define("Employee",
   {
    employeeNum:
    {
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email:Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet:Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.STRING,
    hireDate: Sequelize.STRING
   });

var Department = sequelize.define("Department",
{
    departmentId:
    {
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});


module.exports.initialize = function()
{
    return new Promise((res,rej) => 
    {
        sequelize.sync().then(()=>
        {
            res();
        }).catch(()=>
        {
            rej("Unable to sync the database.");
        });
    });
};

module.exports.getAllEmployees = function()
{
    return new Promise((res,rej) =>
    {
       Employee.findAll().then((data)=>
       {
        resolve(data);
       }).catch((err)=>
       {
        rej("No results returned.");
       });
    });
};

module.exports.getManagers = function() 
{
    return new Promise((res,rej) => 
    {
        var manager = [];
        for (let i = 0; i <employees.length; ++i)
        {
            if(employees[i].isManager == true)
            {
                manager.push(employees[i]);
            }
        }
        if(manager.length == 0)
        {
            rej('No Managers Found!');
        }
        res(employees);
    });
};

module.exports.getDepartments = function() 
{
    return new Promise((res,rej) => 
    {
        Department.findAll().then((data)=>
        {
         resolve(data);
        }).catch((err)=>
        {
         rej("No results returned.");
        }); 
    });
};
/* 
: Adding "addEmployee" function within data-service.js */
module.exports.addEmployee = function(employeeData)
{
    return new Promise((res,rej) => 
    {
        employeeData.isManager = (employeeData.isManager)?true:false;
        for(let t in employeeData)
        {
            if(employeeData[t] == "")
            employeeData[t] = null;
        }

        Employee.create(employeeData).then(()=>
        {
            res();
        }).catch((err) =>
        {
            rej("Unable to Create Employee");
        });
    });
}

/* getEmployeesByStatus(status) */
module.exports.getEmployeesByStatus = function(status)
{
    return new Promise((res,rej) => 
    {
        Employee.findAll(
            {
                where:{status:sta}
            }).then((data)=>
            {
                res(data);
            }).catch((err)=>
            {
                rej("no results returned");
            });
    });
}

module.exports.getEmployeesByDepartment = function(department)
{
    return new Promise((res,rej)=>
    {
        Employee.findAll(
            {
                where:{department: dep}
            }).then((data)=>
            {
                res(data);
            }).catch((err)=>
            {
                rej("no results returned")
            });
    });
}

module.exports.getEmployeesByManager = function(manager)
{
    return new Promise((res,rej) =>
    {
        Employee.findAll({
           where:{employeeManagerNum: manager} 
        }).then((data)=>
        {
            res(data);
        }).catch((err) =>
        {
            rej("No results returned");
        });
    });
}

module.exports.getEmployeeByNum = function(num)
{
    return new Promise((res,rej)=>
    {
        Employee.findAll({
            where:{employeeNum: value} 
         }).then((data)=>
         {
             res(data[0]);
         }).catch((err) =>
         {
             rej("No results returned");
         });
    });
}

module.exports.deleteEmployeeByNum = function(empNum){
    return new Promise((res, rej)=>{
        Employee.destroy(
        {
         where: {employeeNum: empNum}
        }).then(()=>
        {
            res();
        }).catch((err)=>{
            rej("Unable to delete employee");
        });
    })
  }
  

module.exports.updateEmployee = function(employeeData)
{
return new Promise((res,rej) =>
{
   for(let t in employeeData)
   {
    if(employeeData[t] == "")
    {
        employeeData[t] = null;
    }
   } 

   Employee.update(employeeData,{where:{employeeNum: employeeData.employeeNum}})
   .then (()=>
   {
    res();
   }).catch((err)=>
   {
    rej("Unable to update employee");
   })
});
}

module.exports.addDepartment= function(departmentData){
    return new Promise((res, rej)=>
    {
       for (let temp in departmentData)
           {
               if (departmentData[temp]=="")
                   departmentData[temp] = null;
           }
       Department.create(departmentData).then(()=>{
           res();
       }).catch((err)=>{ 
           rej("unable to create department");
       });
    });
  }
  
module.exports.updateDepartment=function(departmentData){
    return new Promise((resolve, reject)=>{
        for (let temp in departmentData)
           {
               if (departmentData[temp]=="")
                   {
                       departmentData[temp] = null;
                   }
           }
       Department.update(departmentData,
       {where: {departmentId: departmentData.departmentId}})
       .then(()=>{
           resolve();
       }).catch((err)=>{
           reject("unable to update department");
       });
    });
  }
  
  
module.exports.getDepartmentById=function(id){
    return new Promise((resolve, reject)=>{
        Department.findAll(
            {where: {departmentId: id}})
            .then((data)=>{
                resolve(data[0]);
            }).catch((err)=>{
                reject("unable to update department");
            });
    });
  }
  
