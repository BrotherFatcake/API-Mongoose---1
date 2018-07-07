"use strict";

//Create a constant to import(require) Express
const express = require("express");

//Create a constant to import(require) Mongoose
const mongoose = require("mongoose");

//Create a constant to import/require Morgan for logging
const morgan = require('morgan');

//mongoose Promise to use global ES6 Promises
mongoose.Promise = global.Promise;

//Create const of PORT, DATABASE_URL to import(require) config.js
const {PORT, DATABASE_URL} = require("./config");

//Create const of {model} to import(require) models.js
//const {Blog} = require("./models");

//Create constant that creates a new app instance by calling top level Express function
const app = express();

//tell app to use express.json
app.use(express.json());

//tell app to use morgan for common logging
app.use(morgan('common'));

//Create const for new `constNameRoute` (can name it anything) to import(require) routeFile.js (can name it anything)
const blogRoute = require('./blogRoute');

//tell app to use args of '/endPointName' and const specified for 'constNameRoute'
app.use('/blogs', blogRoute);



/*	Catch-all and Server Start/Stop		*/

//catch-all endpoint
//tell app to use args * and function with req/res args
app.use("*", function(req, res) {

  //response status 404 and json message 
    res.status(404).json({ message: "Not Found" });
  });


//Server Start/Stop
//declare empty server variable
  let server;
  
//function named startServer takes args `databaseUrl` and `port = PORT`
  function runServer(databaseUrl, port = PORT) {

    //return a new promise with args `resolve` and `reject =>`
    return new Promise((resolve, reject) => {

      //tell mongoose to connect with args `databaseUrl` and `err =>`
      mongoose.connect(databaseUrl, err => {

        //if err return reject err
          if (err) {
            return reject(err);
          }

          //assign `server` = tell app to listen with args `port` and `() =>`
          server = app.listen(port, () => {

            //log to console the app is listening to port `${port}`
              console.log(`Your app is listening on port ${port}`);

              //resolve for outstanding promise
              resolve();
            })

            //on args `error` and `err =>`
            .on("error", err => {

              //mongoose disconnect
              mongoose.disconnect();

              //reject with err for outstanding promise
              reject(err);
            });
        }
      );
    });
  }
  
//Server Stop

//function named stopServer has no arg
  function closeServer() {

    //return mongoose disconnect with no args then `=>`
    return mongoose.disconnect().then(() => {

      //return a new promise with args `resolve` and `reject =>`
      return new Promise((resolve, reject) => {

        //log to console the server is being stopped
        console.log("Closing server");

        //tell `server` to close with arg `err =>`
        server.close(err => {

          //if err return reject with err for outstanding promise
          if (err) {
            return reject(err);
          }

          //resolve for outstanding promise
          resolve();
        });
      });
    });
  }

//Code to allow server to be called directly or via tests
//if require main is strictly equal to module
  if (require.main === module) {

    //runServer with arg `DATABASE_URL` and `catch err =>` log `error err` to console 
    runServer(DATABASE_URL).catch(err => console.error(err));
  }
  
  //export the modules created add, runServer and closeServer
  module.exports = { app, runServer, closeServer };