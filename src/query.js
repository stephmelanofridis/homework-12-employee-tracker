const db = require('../config/connection');
const inquirer = require('inquirer');
const util = require('util');
const consoleTable = require('console.table');
const { displayHeading } = require('./heading');
var clear = require('cli-clear');

const {
    startMenu,
    addNewEmployeeQuestions,
    removeEmployeeQuestions,
    updateEmployeeRoleQuestions,
    addRoleQuestions,
    removeRoleQuestions,
    addDepartmentQuestions,
    removeDepartmentQuestions,
} = require('./questions');


const query = util.promisify(db.query).bind(db);

async function refresh() {
    await displayHeading();
    await startQuestions();
    clear();
};

async function startQuestions() {
    const choice = await inquirer.prompt(startMenu);
    switch (choice.start) {
        case 'View All Employees':
            viewEmployees();
            break;
        case 'Add Employees':
            addNewEmployees();
            break;
        case 'Remove Employees':
            removeEmployees();
            break;
        case 'Update Employees':
            updateEmployeeRoles();
            break;
        case 'View All Roles':
            viewRoles();
            break;
        case 'Add Role':
            addRoles();
            break;
        case 'Remove Role':
            removeRoles();
            break;
        case 'View All Departments':
            viewDepartments();
            break;
        case 'Add Department':
            addDepartments();
            break;
        case 'Remove Department':
            removeDepartments();
            break;
        case 'Exit':
            console.log(`Disconnected from the employees_db database.`.brightMagenta);
            db.end();
            // process.exit();
            break;
    }
}

async function viewEmployees() {
    try {
        const q = await query(`
        SELECT 
            employee.id AS ID, 
        CONCAT (employee.first_name,' ', employee.last_name) 
        AS 'Full Name', 
            role.title AS 'Role', 
            department.name AS Department, 
            role.salary AS Salary, 
        CONCAT (managers.first_name,' ', managers.last_name) AS 'Manager'
        FROM employee 
        INNER JOIN role ON (employee.role_id = role.id) 
        INNER JOIN department ON (department.id = role.department_id)
        LEFT JOIN employee AS managers ON (employee.manager_id = managers.id)
        ORDER BY employee.first_name ASC
        `);
        await console.table(q);
        refresh();
    } catch (err) {
        console.log(err);
    };
};

async function viewRoles() {
    try {
        const q = await query(`
        SELECT 
            role.id AS ID, 
            role.title AS 'Role',  
            role.salary AS Salary, 
            name AS Department
        FROM role 
        INNER JOIN department ON (role.department_id = department.id)
        ORDER BY role.title ASC
        `);
        await console.table(q);
        refresh();
    } catch (err) {
        console.log(err);
    };
};

async function viewDepartments() {
    try {
        const q = await query(`
        SELECT 
            department.id AS ID, 
            department.name AS Department
        FROM department         
        ORDER BY department.name ASC
        `);
        await console.table(q);
        refresh();
    } catch (err) {
        console.log(err);
    };
};

async function addNewEmployees() {
    await clear();
    try {
        const managers = await query(`
        SELECT 
            id AS value,
        CONCAT(first_name, ' ', last_name) AS name
        FROM employee
        ORDER BY employee.first_name ASC
        `);

        managers.push('>>>None<<<');

        const roles = await query(`
        SELECT 
            id AS value, 
        title AS name        
        FROM role
        ORDER BY role.title ASC
        `);

        const choice = await inquirer.prompt(addNewEmployeeQuestions(roles, managers));
        if (choice.manager_id === ">>>None<<<") {
            choice.manager_id = null;
        }

        await query(`
        INSERT INTO employee SET ?`, choice
        );

        console.log(`New employee ${choice.first_name} ${choice.last_name} has been added.`.bgbrightYellow.black);
        await new Promise(resolve => setTimeout(resolve, 2000));
        clear();
        refresh();
    } catch (err) {
        console.log(err)
    };
};

async function removeEmployees() {
    try {
        const employees = await query(`
        SELECT 
            id AS value, 
        CONCAT(first_name, ' ', last_name) AS name        
        FROM employee
        ORDER BY employee.first_name ASC
        `);
        const choice = await inquirer.prompt(removeEmployeeQuestions(employees));
        await query(`
        DELETE FROM employee WHERE ?`,
            {
                id: choice.id
            });

        console.log(`Employee ${choice.first_name} ${choice.last_name} has been removed`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        clear();
        refresh();
    } catch (err) {
        console.log(err);
    };
};

async function updateEmployeeRoles() {
    try {
        const employees = await query(`
        SELECT 
            employee.id AS value, 
        CONCAT(first_name, ' ', last_name , ' -  Current Role: ', role.title ) AS name, 
            role.title AS 'Role'     
        FROM employee
        INNER JOIN role ON (employee.role_id = role.id) 
        ORDER BY employee.first_name ASC
    `);

        const roles = await query(`
        SELECT 
            id AS value, 
            title AS name        
        FROM role
        ORDER BY role.title ASC
    `);

        const choice = await inquirer.prompt(updateEmployeeRoleQuestions(employees, roles));
        await query(`
        UPDATE employee SET ? WHERE ?`,
            [{
                role_id: choice.role_id
            },
            {
                id: choice.id
            }
            ]);

        console.log(`Employee role has been updated to ${role}.`.brightYellow);
        await new Promise(resolve => setTimeout(resolve, 2000));
        clear();
        refresh();
    } catch (err) {
        console.log(err);
    };
};

async function addRoles() {
    try {
        const departments = await query(`
        SELECT 
            id AS value, 
            name       
        FROM department 
        `);
        const choice = await inquirer.prompt(addRoleQuestions(departments));
        await query(`
        INSERT INTO role SET ?`,
            {
                title: choice.title,
                salary: choice.salary,
                department_id: choice.department_id
            });
        console.log(`${choice.role} has been added.`.brightYellow);
        await new Promise(resolve => setTimeout(resolve, 2000));
        clear();
        refresh();
    } catch (err) {
        console.log(err);
    };
};

async function removeRoles() {
    try {
        const roles = await query(`
        SELECT 
            id AS value, 
        CONCAT(title, ' - Salary: ', salary) AS name      
        FROM role 
        `);
        const choice = await inquirer.prompt(removeRoleQuestions(roles));
        await query(`
        DELETE FROM role WHERE ?`,
            {
                id: choice.id
            });
        console.log(`${choice.role} has been removed.`.brightYellow);
        await new Promise(resolve => setTimeout(resolve, 2000));
        clear();
        refresh();
    } catch (err) {
        console.log(err)
    };
};

async function addDepartments() {
    try {
        const choice = await inquirer.prompt(addDepartmentQuestions);
        await query(`
        INSERT INTO department SET ?`,
            {
                name: choice.name
            });
        console.log(`${choice.name} department has been added.`.brightYellow);
        await new Promise(resolve => setTimeout(resolve, 2000));
        clear();
        refresh();
    } catch (err) {
        console.log(err);
    };
};

async function removeDepartments() {
    try {
        const departments = await query(`
        SELECT 
            id AS value, 
            name     
        FROM department
        `);
        const choice = await inquirer.prompt(removeDepartmentQuestions(departments));
        await query(`
        DELETE FROM department WHERE ?`,
            {
                id: choice.id
            }
        );

        console.log(`${choice.name} has been removed.`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        clear();
        refresh();
    } catch (err) {
        console.log(err)
    };
};

module.exports = { startQuestions };