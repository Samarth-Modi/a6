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
const fs = require('fs');
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


