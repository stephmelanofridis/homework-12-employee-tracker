# Employee Tracker
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

For this homework we were required to build a command line application from scratch to manage an employee database using Node.js, Inquirer and MySQL. The application will allow a user to store employees, roles and departments. The user can view all data or make additions or updates. 
## Table of Contents
- [Technologies Used](#technologies-used)
- [Usage](#usage)
- [Walkthrough Video](#walkthrough-video)
- [License](#license)
- [Contributions](#contributions)
- [Questions](#questions)

## Technologies Used
For this homework the following was used:
* Javascript
* Node.js
* npm package asciiart-logo
* npm package console.table
* npm package colors 
* npm package dotenv
* npm package inquirer
* npm package mysql2

## Usage 

1. Install dependencies using     
     npm install

2. Go into the .env.EXAMPLE file, remove the .EXAMPLE and add the database name, your MYSQL username and password

3. Create the database by logging into your MYSQL account using 
    mysql -u root -p
Enter your password, then  
    SOURCE db/schema.sql;  
    SOURCE db/seeds.sql;  
    quit;'

4. Start the application by running 
    node index

6. You will then see a menu, using the arrow keys you can view, add and update the database.

![image](https://user-images.githubusercontent.com/82196946/134287564-fedfd9f1-5d9e-48bb-b816-c9e54e5ffad2.png)

![image](https://user-images.githubusercontent.com/82196946/134287677-aaab525a-4981-4a96-8fe2-e94acba3e999.png)

## Walkthrough Video

Link to walkthrough video: https://watch.screencastify.com/v/ajw9ph0ClasXfd3zY1SY

## License

MIT License

Copyright © 2021 Steph Melanofridis
                
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
                
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
                
    THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Contributions

Anyone can contribute

## Questions

* GitHub Username: stephmelanofridis
* GitHub URL: https://github.com/stephmelanofridis
* Email: stephmelanofridis@bigpond.com
    
Please feel free to email me at any time if you have any questions or concerns regarding this project.

- [Back to Top](#table-of-contents) 
    