const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const session = require('express-session');
const flash = require('connect-flash');

// FileStore for storing the session
const FileStore = require('session-file-store')(session);

require("dotenv").config();

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);



// setup sessions
app.use(session({
  'store': new FileStore(),
  'secret': 'keyboard cat',
  'resave': false,
  'saveUninitialized': true
}))

// setup flash messaging
// because the flash messaging needs session
// so we setup after sessions
app.use(flash());

// use our own custom middleware to extract flash messages
app.use(function (req, res, next) {
  res.locals.successes = req.flash('success');
  res.locals.errors = req.flash('error')
  next();
});


// import in the router
// if we want to require our own files, we have to begin with "./"
const landingRoutes = require('./routes/landing.js');
const productRoutes = require('./routes/products.js');
async function main() {
  // make use of the landing page routes
  // if the url begins with "/", using the landingRoutes router
  app.use('/', landingRoutes);

  // If the URL begins with /products, then use productRoutes
  app.use('/products', productRoutes)

  
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});