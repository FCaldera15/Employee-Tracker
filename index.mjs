import inquirer from "inquirer";
import mysql from "mysql2";
import { async } from "rxjs";

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'company_db',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0
});

const promisePool = pool.promise();

const main = () => {
    inquirer
        .prompt({
            name: "start",
            type: "list",
            message: "what would you like to do?",
            choices: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Add A Department",
                "Add A Role"
            ],
        })
        .then((answer) => {
            switch (answer.start) {

                case "View All Departments":
                    viewAllDepartment();
                    break;

                case "View All Roles":
                    viewAllRole();
                    break;

                case "View All Employees":
                    viewAllEmployee();
                    break;

                case "Add A Department":
                    addDepartment();
                    break;

                case "Add A Role":
                    addRole();
                    break;
            }
        });
};





async function viewAllDepartment() {
    const [rows] = await promisePool.query("SELECT * FROM department");
    console.table(rows);
    return main();
};

async function viewAllRole() {
    const [rows] = await promisePool.query("SELECT id, title, salary FROM role");
    console.table(rows);
    return main();
};

async function viewAllEmployee() {
    const [rows] = await promisePool.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id ")
    console.table(rows);
    return main();
};

async function addDepartment() {

    const answer = await inquirer.prompt([
        {
            type: "input",
            name: "newDepartment",
            message: "What is the name of the new department?",
        },
    ]);

    const newDept = await promisePool.query(`INSERT INTO department (name) VALUES ("${answer.newDepartment}")`);
    console.log(`Successfully added ${answer.newDepartment} into the database`);
    main();

}

async function addRole() {

    const answer = await inquirer.prompt([
        {
            type: "input",
            name: "newRole",
            message: "What is the name of the new role?",
        },
        {
            type: "input",
            name: "newRoleSalary",
            message: "What is the salary of the role?"
        },
        {
            type: "list",
            name: "newRoleDepartment",
            message: "What department does the role belong to?",
            choices: [...department],
        }
    ]);

    const newRole = await promisePool.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answer.newRole}","${answer.newRoleSalary}", "${answer.newRoleDepartment}")`);
    console.log(`Successfully added ${answer.newRole} into the database`);
    main();

}



main();