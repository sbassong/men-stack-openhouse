const dotenv = require('dotenv');
dotenv.config();
const path = require("path");
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');

const isSignedIn = require("./middleware/is-signed-in.js")
const passUserToView = require("./middleware/pass-user-to-view.js")

const authController = require('./controllers/auth.js');
const listingsController = require('./controllers/listings.js');

const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));


app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passUserToView)


app.get('/', (req, res) => {

  res.render('index.ejs', {
    user: req.session.user,
  });
});


app.use('/auth', authController);
// isSignedIn needs to be below the controller handling signing in
app.use(isSignedIn)

// Any other routes after the middleware isSignedIn
app.use("/listings", listingsController)


module.exports = app;


// Recommended workflow for setting up an entity's CRUD
// 0. - Planning:
//   - set up user stories
//   - ERD (DB relationships)
//   - conceptualize or define the route paths/endpoints

// 1. Create model
//   - require mongoose
//   - create the schema with the properties
//   - compile the model
//   - export the model

// 2. Create the controllers module
//   - import express then extract the router
//   - import the Model(s) you'll use to interact with the DB
//   - SET UP ROUTES
//   - export the router
//   - import the router as a controller in server.js
//   - have the app use the controller and define the initial path

// 3. Create your middlewares (isSignedIn, passUserToView) and export them
//  - Once created import them to the server.js file
//  - Provide them to be used by the app/server

// 4. Define the route in the controller
//  - Method and endpoint as a comment (optional)
//  - define the router with the appropriate method
// - Give it an endpoint string, and a async callback function as arguments
// - Write the logic for the route which might include:
  // - validating data
  // - interacting with the model
  // - rendering a template/view
  // - redirecting to a view
  // - and so on...

// 5. Create the template/view in the views directory
  // - example: new.ejs in views/listings
  // - this template might have a link to a route or a form action to trigger a route (ex: post route)