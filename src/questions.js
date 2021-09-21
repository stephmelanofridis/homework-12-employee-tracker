const inquirer = require('inquirer');
const mysql = require('mysql2');
const util = require('util');
const consoleTable = require('console.table');
var clear = require('cli-clear');
const colors = require('colors');

const addNewEmployeeQuestions = (roles, managers) => [
    {
        type: 'input',
        message: 'What is the new employees first name?'.brightCyan,
        name: 'first_name',
    },
    {
        type: 'input',
        message: 'What is the new employees last name?'.brightCyan,
        name: 'last_name',
    },
    {
        type: 'list',
        message: 'What is the new employees role?'.brightCyan,
        name: 'role_id',
        choices: roles,
    },
    {
        type: 'list',
        message: 'Who is the new employees manager?'.brightCyan,
        name: 'manager_id',
        choices: managers,
    }
];

const removeEmployeeQuestions = (employees) => [
    {
        type: 'rawlist',
        message: 'Select an employee to remove.'.brightCyan,
        name: 'id',
        choices: employees,
    }
];

const updateEmployeeRoleQuestions = (employees, roles) => [
    {
        type: 'list',
        message: 'Select the employee whos role you would like to update.'.brightCyan,
        name: 'id',
        choices: employees,
    },
    {
        type: 'list',
        message: 'What is the employees new role?'.brightCyan,
        name: 'role_id',
        choices: roles,
    }
];

const addRoleQuestions = (departments) => [
    {
        type: 'input',
        message: 'What is the title of the new role?'.brightCyan,
        name: 'title',
    },
    {
        type: 'input',
        message: 'What is the salary of the new role?'.brightCyan,
        name: 'salary',
    },
    {
        type: 'list',
        message: 'What department does the new role belong to?'.brightCyan,
        name: 'department_id',
        choices: departments,
    }
];

const removeRoleQuestions = (roles) => [
    {
        type: 'rawlist',
        message: 'Select a role to be removed.'.brightCyan,
        name: 'id',
        choices: roles,
    }
];

const addDepartmentQuestions = [
    {
        type: 'input',
        message: 'What is the name of the new department?'.brightCyan,
        name: 'name',
    }
];

const removeDepartmentQuestions = (departments) => [
    {
        type: 'rawlist',
        message: 'Select department to be removed.'.brightCyan,
        name: 'id',
        choices: departments,
    }
];

module.exports = {
    addNewEmployeeQuestions,
    removeEmployeeQuestions,
    updateEmployeeRoleQuestions,
    addRoleQuestions,
    removeRoleQuestions,
    addDepartmentQuestions,
    removeDepartmentQuestions
};