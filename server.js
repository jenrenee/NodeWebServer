const express = require('express');
//**************************************************************************************
// USING NPM PACKAGE hbs WHICH IS AN EXPRESS VIEW ENGINE FOR handlebars.js
//**************************************************************************************
const hbs = require('hbs');
const fs = require('fs');

//******************************************************
// when running through HEROKU, the port will be used
//  if running locally, we need a default since the 
//  port environment variable will not exist
//******************************************************
const port = process.env.PORT || 3000;

var app = express();

//****************************************************************************************************
// hbs.registerPartials SETS UP USING PARTIAL VIEWS - DECLARE IT BEFORE SETTING THE VIEW ENGINE
//  IMPORTANT!! we can set nodemon to watch for changes in files with specific extensions - 
//      ie. nodemon server.js -e js,hbs WATCHES FOR CHANGES IN .js and .hbs files
// app.set TELLS express (app) TO USE THE hbs VIEW ENGINE
//****************************************************************************************************
// var partialURL = __dirname + '/views/partials';
// console.log(partialURL);
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

//**************************************************************************************
// __dirname STORES THE PATH TO THE PROJECTS DIRECTORY - ie NodeWebServer
// app.use is how you register middleware then provide the middleware to use
//**************************************************************************************
// app.use(express.static(__dirname + '/public'));

//****************************************************************************************
//  THE next param will tell express when we are done so if we do something asyncrenous,
//  the middleware will not move on - only when we call next will the app continue
//****************************************************************************************
app.use((request, response, next) => {
    var now = new Date().toString();
    var log = `${now}: ${request.method} ${request.url}`;
    //console.log(log);
   fs.appendFile('server.log', log + '\n');
    //****************************************************************
    //if using Node 7 or greater the following syntax should be used
    //  otherwise a deprication warning will be thrown
    //****************************************************************
    // fs.appendFile('server.log', log + '\n', (error) => {
    //     if (err){
    //         console.log('Unable to append to server.log');
    //     }
    // });
    //****************************************************************
    next();
})

// app.use((request, response, next) => {
//     response.render('maintenance.hbs');
// });

//**************************************************************************************
// THIS WAS MOVED FROM UP TOP - IF BEFORE THE 'MAINTENANCE' THEN USER CAN STILL GET
//  TO PUBLIC DIRECTORY - ORDER IS IMPORTANT
//**************************************************************************************
app.use(express.static(__dirname + '/public'));

//**************************************************************************************
// hbs HELPERS - PUT IN A SEPARATE FILE?
//**************************************************************************************
//this is being called from the footer.hbs
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

//the following is called a ROUTE (this would be the root route for now)
// the (request,response) is called a handler
app.get('/', (request, response) => {
    response.render('home.hbs', {
        headerVerbiage: 'HOME PAGE',
        pageTitle: 'You have landed on the Home Page',
        welcomeMessage: 'Welcome to the Home Page'
        //currentYear: new Date().getFullYear()
    });

    // response.send('<h1>HELLO EXPRESS</h1>');
    // response.send({
    //     name: 'jen',
    //     likes: [
    //         'Beer',
    //         'Fishing',
    //         'Dogs'
    //     ]
    // })
});

app.get('/projects', (request, response) => {
    response.render('projects.hbs', {
        headerVerbiage: 'Projects',
        pageTitle: 'Current Projects',
        welcomeMessage: 'Your projects go here'
    });
});

app.get('/about', (request, response) => {
    //response.send('ABOUT PAGE');
    response.render('about.hbs', {
        headerVerbiage: 'ABOUT PAGE',
        pageTitle: 'You have landed on the About Page'
        // currentYear: new Date().getFullYear()
    });
});

// app.get('/maintenance', (request, response) => {
//     //response.send('ABOUT PAGE');
//     response.render('maintenance.hbs');
// });

app.get('/bad', (request, response) => {
    response.send({
        errorNumber: "400",
        errorMessage: "Unable to handle request"
    });
});
// 3000 is a port number
//app.listen(3000);
//adding another parameter
// app.listen(3000, () => {
//     console.log("SERVER IS UP ON PORT 3000")
// });
//****************************************************************
//  CONNECTING TO HEROKU UNSING ENVIRONMENT VARIABLE
//  (THE COMMAND TO SEE ENVIRONMENT VARIABLES IS "ENV" AT THE 
//      BASH TERMINAL COMMAND LINE)
//  ALSO - SEE package.json script "start"
// heroku will be looking for the "start" script to run the app
//      TO EXECUTE AND USE THE "start" script, run "npm start"
//****************************************************************
app.listen(port, () => {
    console.log(`SERVER IS UP ON PORT ${port}`);
});