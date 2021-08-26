INSERT INTO
  department(name)
VALUES
  ("Operations"),
  ("Finance"),
  ("Human Resources"),
  ("Marketing");
SELECT
  *
FROM
  department;
INSERT INTO
  role (title, salary, department_id)
VALUES
  ("Engineering Manager", 120000, 1),
  ("Civil Engineer", 65000, 1),
  ("Accounts Manager", 58000, 2),
  ("Payroll Officer", 45000, 2),
  ("HR Director", 95000, 3),
  ("Recruitment Officer", 50000, 3),
  ("Brand Manager", 55000, 4),
  ("Marketing Assistant", 45000, 4);
SELECT
  *
FROM
  role;
INSERT INTO
  employee (first_name, last_name, role_id, manager_id)
VALUES
  ("Andrew", "Robinson", 1, 1),
  ("John", "Piotroski", 2, NULL),
  ("Allison", "Jacobs", 3, 2),
  ("Christina", "Gomez", 4, NULL),
  ("Brett", "Whetstone", 5, 3),
  ("Joe", "Spiegel", 6, NULL),
  ("Vera", "West", 7, 4),
  ("Fay", "Beneventi", 8, NULL);