INSERT INTO department (name)
VALUES ("Front End"),
("Shipping"),
("Receiving"),
("Production");

INSERT INTO role (title, salary, department_id)
VALUES ("Plant Manager", 200000, 1),
("Human Resources", 120000, 1),
("Chemical Engineer", 140000, 1),
("Shipping Manager", 170000, 2),
("Forklift Driver", 50000, 2),
("Loader", 55000, 2),
("Receiving Manager", 170000, 3),
("Orderer", 75000, 3),
("Down Stacker", 55000, 3),
("Production Manager", 140000, 4),
("Foamhead Operator", 60000, 4),
("Robot Operator", 55000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Micheal", "Hicks", 1, NULL),
("Stacey", "Ugalde", 2, 1),
("Kurk", "Chuck", 3, 1),
("Mindy", "Johnson", 4, NULL),
("Marcos", "Amaro", 5, 4),
("Bryan", "Aguilar", 6, 4),
("Scott", "Pilgrim", 7, NULL),
("Kevin", "Cabrerra", 8, 7),
("Juan", "Salinas", 9, NULL),
("Justin", "Rayburn", 10, 9),
("Carlos", "Moncada", 11, 9);
