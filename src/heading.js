const heading = require('asciiart-logo');

const description = `A command line application that allows you to view and update employee and manager details in one place`

function displayHeading() {
    console.log(
        heading({
            name: 'Employee Tracker',
            font: 'Sweet',
            lineChars: 30,
            padding: 3,
            borderColor: 'bold-yellow',
            textColor: 'bold-magenta',
        })
            .emptyLine()
            .emptyLine()
            .center(description)
            .render()
    )
};

module.exports = { displayHeading }