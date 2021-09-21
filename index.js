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
    const addDepartmentQuestion = [
        {
            type: 'input',
            message: 'What is the name of the new department?'.brightCyan,
            name: 'departmentName',
        }
    ]
    await inquirer.prompt(addDepartmentQuestion)
        .then(async (data) => {
            await db.query(`
            INSERT INTO 
                department (name) 
            VALUES 
                (?)
            `, data.departmentName)
                .then((results) => {
                    console.log(`\nYou have successfully added ${data.departmentName}\n`)
                });
        });
    setTimeout(startMenu, 1000);
};

async function addRoles() {
    const addRoleQuestions = [
        {
            type: 'input',
            message: 'What is the title of the new role?'.brightCyan,
            name: 'roleTitle',
        },
        {
            type: 'input',
            message: 'What is the salary of the new role?'.brightCyan,
            name: 'salary',
        },
        {
            type: 'list',
            message: 'What department does the new role belong to?'.brightCyan,
            name: 'departmentName',
            choices: departmentArr()
        },
    ]
    inquirer.prompt(addRoleQuestions).then(async (data) => {
        const { roleName, departmentName, salary } = data
        await db.query(`
        INSERT INTO 
            role (title,salary,department_id) 
        SELECT 
            ?,
            ?,
            id
        FROM 
            department 
        WHERE 
            name = ?;
        `, [roleName, salary, departmentName])
            .then((results) => console.log(`\nYou have successfully added ${roleName} to ${departmentName}\n`))
            .catch((err) => console.log(err));
        setTimeout(startMenu, 1000);
    });
};

async function addEmployee() {
    let roleArray = await roleArr();
    roleArray = roleArray.map(i => i.title)
    let managerArray = await managerArr();
    managerArray = managerArray.map(j => j.manager_name)
    const addNewEmployeeQuestions = [
        {
            type: 'input',
            message: 'What is the new employees first name?'.brightCyan,
            name: 'firstName',
        },
        {
            type: 'input',
            message: 'What is the new employees last name?'.brightCyan,
            name: 'lastName',
        },
        {
            type: 'list',
            message: 'What is the new employees role?'.brightCyan,
            name: 'roleName',
            choices: roleArray,
        },
        {
            type: 'list',
            message: 'Who is the new employees manager?'.brightCyan,
            name: 'managerName',
            choices: [...managerArray, 'No manager']
        },
    ]
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
            await db.query(`
            INSERT INTO 
                employee (first_name,last_name,role_id,manager_id) 
            SELECT 
                ?,
                ?,
                id,
                ? 
            FROM 
                role 
            WHERE 
                title = ?;
            `,
                [firstName, lastName, managerId, roleName])
                .then((results) => console.log(`\nSuccessfully added ${firstName} ${lastName} with manager ${managerName}\n`))
                .catch((err) => console.log(err))
            setTimeout(startMenu, 1000);
        });
};

async function updateEmployeeRole() {
    let employeeArray = await employeeArr()
    let roleArray = await roleArray()
    roleArray = roleArray.map(i => i.title)
    const updateEmployeeRoleQuestions = [
        {
            type: 'list',
            message: 'Select the employee whos role you would like to update.'.brightCyan,
            name: 'employeeName',
            choices: employeeArray,
        },
        {
            type: 'list',
            message: 'What is the employees new role?'.brightCyan,
            name: 'roleName',
            choices: roleArray,
        }
    ];
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
        })
}

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
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartments();
                break;
            case 'Add a role':
                addRoles();
                break;
            case 'Add an employee':
                addNewEmployees();
                break;
            case 'Update an employees role':
                updateEmployeeRoles();
                break;
            case 'Remove a department':
                removeDepartments();
                break;
            case 'Remove an employee':
                removeEmployees();
                break;
            case 'Remove a role':
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