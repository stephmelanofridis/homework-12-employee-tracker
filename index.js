const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();
const util = require('util');
const consoleTable = require('console.table');
const heading = require('asciiart-logo');
const colors = require('colors');
var clear = require('cli-clear');

const {
    addNewEmployeeQuestions,
    //removeEmployeeQuestions,
    updateEmployeeRoleQuestions,
    addRoleQuestions,
    //removeRoleQuestions,
    addDepartmentQuestions,
    //removeDepartmentQuestions
} = require('./src/questions');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`Connected to employees_db database.`)
);

db.query = util.promisify(db.query);

const departmentArr = () => {
    return db.query('SELECT DISTINCT name from department')
}

const roleArr = () => {
    return db.query('SELECT DISTINCT title from role')
}

const managerArr = () => {
    return db.query('SELECT CONCAT(first_name," ",last_name) as manager_name from employee')
}

const employeeArr = () => {
    return db.query('SELECT CONCAT(first_name," ",last_name) as name, id from employee')
}

const viewDepartments = () => {
    console.log('\nAll departments:\n')
    db.query(`
    SELECT 
        * 
    FROM 
        department
    `, function (err, results) {
        console.table(results);
        setTimeout(startMenu, 1000);
    }).catch((err) => console.log(err));
};

const viewRoles = () => {
    console.log('\nAll roles:\n')
    db.query(`
    SELECT 
        r.title, 
        r.id as role_id, 
        d.name as department, 
        salary
    FROM role r
    JOIN department d ON r.department_id = d.id`, function (err, results) {
        console.table(results);
        setTimeout(startMenu, 1000);
    }).catch((err) => console.log(err));
};

const viewEmployees = () => {
    console.log('\nAll employees:\n')
    db.query(`
      SELECT 
        e.ID as employee_id,
        e.first_name,
        e.last_name,
        r.title as job_title,
        d.name as department,
        salary,
      CONCAT(m.first_name," ",m.last_name) as manager
      FROM 
        employee e 
      JOIN role r ON e.role_id = r.id 
      JOIN department d ON r.department_id = d.id 
      LEFT JOIN employee m ON e.manager_id = m.id 
      `, function (err, results) {
        console.table(results)
        startMenu();
    }).catch((err) => console.log(err));
};

const addDepartments = async () => {
    await inquirer.prompt(addDepartmentQuestions)
        .then(async (data) => {
            await db.query(`INSERT INTO department (name) VALUES (?)`, data.departmentName)
                .then((results) => {
                    console.log(`\nYou have successfully added ${data.departmentName}\n`)
                });
        });
    setTimeout(startMenu, 1000);
};

async function addRoles() {
    inquirer.prompt(addRoleQuestions).then(async (data) => {
        const { roleName, departmentName, salary } = data
        await db.query(`INSERT INTO role (title,salary,department_id) 
            SELECT ?,?,id FROM department WHERE name = ?;`, [roleName, salary, departmentName])
            .then((results) => console.log(`\nYou have successfully added ${roleName} to ${departmentName}\n`))
            .catch((err) => console.log(err));
        setTimeout(startMenu, 1000);
    });
};

async function addNewEmployees() {
    inquirer.prompt(addNewEmployeeQuestions)
        .then(async (data) => {
            console.log(data)
            const { firstName, lastName, roleName, managerName } = data
            var managerId = undefined
            await db.query('SELECT id FROM employee WHERE CONCAT(first_name," ",last_name) = ?', managerName)
                .then((results) => {
                    if (managerName === "No manager") {
                        return
                    }
                    managerId = results[0].id
                })
                .catch((err) => console.log(err))
            await db.query(`INSERT INTO employee (first_name,last_name,role_id,manager_id) SELECT ?,?,id,? FROM role WHERE title = ?;`,
                [firstName, lastName, managerId, roleName])
                .then((results) => console.log(`\nNew employee ${firstName} ${lastName} has been added with manager ${managerName}\n`))
                .catch((err) => console.log(err))
            setTimeout(initQuestions, 1000);
        });
};

async function updateEmployeeRole() {
    inquirer.prompt(updateEmployeeRoleQuestions)
        .then(async (data) => {
            const { employeeName, roleName } = data
            var roleId = undefined
            await db.query('SELECT id FROM role WHERE title = ?', roleName)
                .then((results) => {
                    roleId = results[0].id
                })
                .catch((err) => console.log(err))
            await db.query(`UPDATE employee SET role_id = ? WHERE CONCAT(first_name," ",last_name) = ?`, [roleId, employeeName])
                .then((results) => {
                    console.log(`\nSuccessfuly updated ${employeeName}'s role to ${roleName}\n`)
                })
                .catch((err) => console.log(err))
            setTimeout(startMenu, 1000);
        });
};

const startMenu = () => {
    const menuQuestions = [
        {
            type: 'list',
            message: 'What would you like to do?'.brightCyan,
            name: 'menu',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employees role',
                'Remove an employee',
                'Remove a role',
                'Remove a department',
                'Exit'
            ]
        }
    ];

    inquirer.prompt(menuQuestions).then((data) => {
        switch (data.menu) {
            case 'View All Departments':
                viewDepartments();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'View All Employees':
                viewEmployees();
                break;
            case 'Add Department':
                addDepartments();
                break;
            case 'Add Role':
                addRoles();
                break;
            case 'Add Employees':
                addNewEmployees();
                break;
            case 'Update Employee Role':
                updateEmployeeRoles();
                break;
            case 'Remove Department':
                removeDepartments();
                break;
            case 'Remove Employees':
                removeEmployees();
                break;
            case 'Remove Role':
                removeRoles();
                break;
            case 'Exit':
                console.log(`Disconnected from the employees_db database.`.brightMagenta);
                process.exit();
        }
    }).catch((err) => console.log(err));
}

// async function removeEmployees() {
//     try {
//         const employees = await query(`
//         SELECT 
//             id AS value, 
//         CONCAT(first_name, ' ', last_name) AS name        
//         FROM employee
//         ORDER BY employee.first_name ASC
//         `);
//         const choice = await inquirer.prompt(removeEmployeeQuestions(employees));
//         await query(`
//         DELETE FROM employee WHERE ?`,
//             {
//                 id: choice.id
//             });

//         console.log(`Employee ${choice.first_name} ${choice.last_name} has been removed`);
//         await new Promise(resolve => setTimeout(resolve, 2000));
//         clear();
//         refresh();
//     } catch (err) {
//         console.log(err);
//     };
// };



// async function removeRoles() {
//     try {
//         const roles = await query(`
//         SELECT 
//             id AS value, 
//         CONCAT(title, ' - Salary: ', salary) AS name      
//         FROM role 
//         `);
//         const choice = await inquirer.prompt(removeRoleQuestions(roles));
//         await query(`
//         DELETE FROM role WHERE ?`,
//             {
//                 id: choice.id
//             });
//         console.log(`${choice.role} has been removed.`.brightYellow);
//         await new Promise(resolve => setTimeout(resolve, 2000));
//         clear();
//         refresh();
//     } catch (err) {
//         console.log(err)
//     };
// };



// async function removeDepartments() {
//     try {
//         const departments = await query(`
//         SELECT 
//             id AS value, 
//             name     
//         FROM department
//         `);
//         const choice = await inquirer.prompt(removeDepartmentQuestions(departments));
//         await query(`
//         DELETE FROM department WHERE ?`,
//             {
//                 id: choice.id
//             }
//         );

//         console.log(`${choice.name} has been removed.`);
//         await new Promise(resolve => setTimeout(resolve, 2000));
//         clear();
//         refresh();
//     } catch (err) {
//         console.log(err)
//     };
// };

// const heading = require('asciiart-logo');

// const description = `A command line application that allows you to view and update employee and manager details in one place`

function displayHeading() {
    console.log(
        heading({
            name: 'Employee Tracker',
            font: 'Sweet',
            // lineChars: 30,
            padding: 3,
            borderColor: 'bold-yellow',
            textColor: 'bold-magenta',
        })
            .emptyLine()
            .emptyLine()
            .render()
    )
};


const init = () => {
    displayHeading();
    startMenu();
}

init();