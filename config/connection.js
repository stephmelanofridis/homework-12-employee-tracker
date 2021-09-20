require('dotenv').config();
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    console.log(`Connected to the employees_db database. `)
    if (err) throw err;
});

module.exports = db;