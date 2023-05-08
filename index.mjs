// Imported inquirer and mysql2
import inquirer from "inquirer";
import mysql from "mysql2";
import { title } from "process";
import { async } from "rxjs";

// Connect to database
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'company_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Connected promise
const promisePool = pool.promise();

// Function to show options in starting up node index.mjs
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
                "Add A Role",
                "Add Employee",
                "Update Employee Role"
            ],
        })
        .then((answer) => {
            switch (answer.start) {
                //options available 
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

                case "Add Employee":
                    addEmployee();
                    break;

                case "Update Employee Role":
                    updateEmployee();
                    break;
            }
        });
};




// Function to view all the departments
async function viewAllDepartment() {
    const [rows] = await promisePool.query("SELECT * FROM department");
    console.table(rows);
    return main();
};

// Function to view all the roles 
async function viewAllRole() {
    const [rows] = await promisePool.query("SELECT id, title, salary FROM role");
    console.table(rows);
    return main();
};

// Function to view all the employees and their role, department, salary and manager into one table
async function viewAllEmployee() {
    const [rows] = await promisePool.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id ")
    console.table(rows);
    return main();
};

// Function to add a new department 
async function addDepartment() {
    let { newDepartment } = await inquirer.prompt([
        {
            type: "input",
            name: "newDepartment",
            message: "What is the name of the new department?",
        },
    ]);

    const [rows] = await promisePool.query("INSERT INTO department (name) VALUES (?)", newDepartment);
    console.log("Successfully added new department into the database");
    return main();

}

// Function to add a new role
async function addRole() {
    const [selectDept] = await promisePool.query("SELECT id, name FROM department");
    const departments = selectDept.map(row => ({ name: row.name, value: row.id }));

    let { newRole, newRoleSalary, newRoleDepartment } = await inquirer
        .prompt([
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
                choices: [...departments],
            }
        ]);

    const [row] = await promisePool.query('INSERT INTO role (title, salary, department_id) VALUE (?, ?, ?)', [newRole, newRoleSalary, newRoleDepartment]);
    console.log("Successfully added new role into the database");
    main();

}

// Function to add a new employee, asking for name, what their role is going to be and their manager 
async function addEmployee() {
    const [rolesArr, managerArr] = await Promise.all([
        promisePool.query("SELECT id, title FROM role"),
        promisePool.query("SELECT id, CONCAT(first_name, ' ', last_name) AS manager_name FROM employee")
    ]);

    const roles = rolesArr[0].map(row => ({ name: row.title, value: row.id }));
    const managers = managerArr[0].map(row => ({ name: row.manager_name, value: row.id }));


    let { firstName, lastName, role, managerName } = await inquirer
        .prompt([
            {
                type: "input",
                name: "firstName",
                message: "What is the employee's first name"
            },
            {
                type: "input",
                name: "lastName",
                message: "What is the employee's last name",
            },
            {
                type: "list",
                name: "role",
                message: "What is the employee's role?",
                choices: [...roles]
            },
            {
                type: "list",
                name: "managerName",
                message: "Who is the employee's manager?",
                choices: [{ name: "None", value: null }, ...managers]
            }
        ]);
    const [rows] = await promisePool.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)", [firstName, lastName, role, managerName]);
    console.log(`Added ${firstName} ${lastName} to the database`);
    main()
}

// Function to update a current employee's role 
async function updateEmployee() {
    const [rolesArr, employeeArr] = await Promise.all([
        promisePool.query("SELECT id, title FROM role"),
        promisePool.query("SELECT id, CONCAT(first_name, ' ', last_name) AS employee_name FROM employee")
    ]);

    const roles = rolesArr[0].map(row => ({ name: row.title, value: row.id }));
    const employees = employeeArr[0].map(row => ({ name: row.employee_name, value: row.id }));

    let { employeeName, role } = await inquirer
        .prompt([
            {
                type: "list",
                name: "employeeName",
                message: "Which employee's role do you want to update?",
                choices: [...employees]
            },
            {
                type: "list",
                name: "role",
                message: "Which role do you want to assign the selected employee?",
                choices: [...roles]
            }
        ]);

    const [rows] = await promisePool.query("UPDATE employee SET role_id = ? WHERE id = ?", [role, employeeName]);
    console.log("Updated employee's role");
    main()
};


main();