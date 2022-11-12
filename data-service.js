/*************************************************************************
* BTI325– Assignment 3
* for this assignment, I took the help of my Friend kush while assignment.
other than that I did everything by myself.
*
* Name: Samarth Modi Student ID: 133357202 Date: 28-10-2022
*
* Your app’s URL (from Cyclic Heroku) that I can click to see your application:
* https://whispering-depths-02754.herokuapp.com/
*
*************************************************************************/ 
const fs = require('fs');
const { resolve } = require('path');
let employees = [];
let departments = [];

module.exports.initialize = function()
{
    return new Promise((res,rej) => 
    {
        fs.readFile('./data/employees.json',(err,data) => 
        {
            if(err)
            {
                rej(err);
            }
            employees = JSON.parse(data);
            res();
        });
        fs.readFile('./data/departments.json',(err,data) =>
        {
            if(err)
            {
                rej(err);
            }
            departments = JSON.parse(data);
            res();
        });
    });
};

module.exports.getAllEmployees = function()
{
    return new Promise((res,rej) =>
    {
        if(employees.length == 0)
        {
            rej('No Employee Found!');
        }
        res(employees);
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
        if(departments.length == 0)
        {
            rej('No Department Found!');
        }
        res(departments);
    });
};
/* 
: Adding "addEmployee" function within data-service.js */
module.exports.addEmployee = function(employeeData)
{
    return new Promise((res,rej) => 
    {
        if(employeeData.isManager == undefined)
        {
            employeeData.isManager = false;
        }
        else
        {
            employeeData.isManager = true;
        }

        employeeData.employeeNum = employees.length+1;
        employees.push(employeeData);

        res(employees);
    });
}

/* getEmployeesByStatus(status) */
module.exports.getEmployeesByStatus = function(status)
{
    return new Promise((res,rej) => 
    {
        var empObj = [];

        for(var i = 0; i < employees.length; i++)
        {
            if(employees[i].status == status)
            {
                empObj.push(employees[i]);
            }
        }

        if(employees.length = 0)
        {
            rej("no results returned");
        }
        res(empObj);
    });
}

module.exports.getEmployeesByDepartment = function(department)
{
    return new Promise((res,rej)=>
    {
        var empobj = [];
        
        for(var i =0; i < employees.length; i++)
        {
            if(employees[i].department == department)
            {
                empobj.push(employees[i]);
            }
        }

        if(employees.length == 0)
        {
            rej("no results returned");
        }
        res(empobj);
    });
}

module.exports.getEmployeesByManager = function(manager)
{
    return new Promise((res,rej) =>
    {
        var Empobj = [];
        for(var i = 0; i < employees.length; i++)
        {
            if(employees[i].employeeManagerNum == manager)
            {
                Empobj.push(employees[i]);
            }
        }

        if(employees.length == 0)
        {
            rej("no results returned");
        }
        res(Empobj);
    });
}

module.exports.getEmployeeByNum = function(num)
{
    return new Promise((res,rej)=>
    {
        var EMPobj = [];

        for( var i = 0; i < employees.length; i++)
        {
            if(employees[i].employeeNum == num)
            {
                EMPobj.push(employees[i]);
            }
        }

        if(employees.length == 0)
        {
            rej("no results returned");
        }
        res(EMPobj);
    });
}

module.exports.updateEmployee = function(employeeData)
{
return new Promise((res,rej) =>
{
    let x = false;
    for(let i = 0; i < Emp.length;i++)
    {
        if(Emp[i].SSN == employeeData.SSN)
        {
            Emp[i] = employeeData;
            Emp[i] = employeeNum = i +1;
            x= true;
        }
    }

    if(x == false)
    {
        rej("Data Not found");
    }else
    {
        res();
    }
});
}

