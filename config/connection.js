require("dotenv").config();
const mysql2 = require("mysql2");

const db = mysql2.createConnection({
    host: 'localhost',
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
},

    console.log(`Connected to the database. `));

db.connect((err) => {
    if (err) throw err;
});

module.exports = db;