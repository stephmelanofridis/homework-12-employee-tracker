require("dotenv").config();
const mysql2 = require("mysql2");

const db = mysql2.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    console.log(`Connected to the database. `)
    if (err) throw err;
});

module.exports = db;