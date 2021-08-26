require('dotenv').config();
const db = require('./config/connection');
const { startQuestions } = require('./src/query');
const { displayHeading } = require('./src/heading');
const clear = require('cli-clear');

async function init() {
    // await 
    clear();
    // await 
    console.log(`Connected to the employees_db database.`.brightYellow.bgBlack);
    // await 
    displayHeading();
    startQuestions();
};

init();

