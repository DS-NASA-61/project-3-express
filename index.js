const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const session = require('express-session');
const flash = require('connect-flash');
const csrf = require('csurf')
const Handlebars = require('handlebars');

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

hbs.registerHelper('log', function (value) {
  console.log(value);
});

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);


// configure server to serve static files
app.use(express.static('public'));

// setup sessions
app.use(session({
  'store': new FileStore(),
  'secret': process.env.SESSION_SECRET_KEY,
  'resave': false,
  'saveUninitialized': true
}))

// setup flash messaging
// because the flash messaging needs session
// so we setup after sessions
app.use(flash());


// enable csrf (after enabling sessions)
// EVERY POST ROUTE (every app.post or router.post) will be protected by CSRF
app.use(csrf());

// use our own proxy mdidleware to initialize csrf selectively
// (i.e so that we can exclude certain routes from csrf)
// because routes use other means of authentication (e.g.JWT tokens) and do not need CSRF protection.?
// const csrfInstance = csrf();
// app.use(function(req, res, next){
//   if(req.url == "/checkout/process_payment" || req.url.slice(0,5) === "/api/"){
//     next(); // to exempt the route from CSRF
//   } else{
//     // enable csrf for requests that does not access the payment
//     csrfInstance(req, res, next)
//   }
// })

// this middleware is to handle invalid csrf tokens errors
// make sure to put this immediately after the app.use(csrf())
app.use(function (err, req, res, next) {
  // the error parameter is to handle errors
  if (err && err.code === "EBADCSRFTOKEN") {
    req.flash('error', "The form has expired. Please try again");
    res.redirect('back'); // go back in history one step
  } else {
    next();
  }
});

// once csfr is initialized, csrfToken() method will be ready to use to generate token
//share CSRF token with hbs files
app.use(function (req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
})

// use our own custom middleware to extract flash messages
// by setting properties on res.locals (in 
// this case `success` and `errors` event),
// properties will be available to all views that are 
// rendered after this middleware function has been executed.
// and now since the middleware function is mounted globally using 
// app.use() with no path specified. it will be executed for 
// every incoming HTTP request before any other middleware functions or route handlers.
app.use(function (req, res, next) {
  res.locals.successes = req.flash('success');
  res.locals.errors = req.flash('error')
  next();
});



// this global middleware is to add user data across all hbs files
// sets the user property of res.locals to the user property of req.session
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});




// import in the router
// if we want to require our own files, we have to begin with "./"
const landingRoutes = require('./routes/landing.js');
const productRoutes = require('./routes/products.js');
const userRoutes = require('./routes/users.js');
const cloudinaryRoutes = require('./routes/cloudinary.js');
const cartRoutes = require('./routes/cart.js');


async function main() {
  // make use of the landing page routes
  // if the url begins with "/", using the landingRoutes router
  app.use('/', landingRoutes);

  // If the URL begins with /products, then use productRoutes
  app.use('/products', productRoutes)

  // If the URL begins with /users, then use the userRoutes
  app.use('/users', userRoutes);

  app.use('/cloudinary', cloudinaryRoutes);

  app.use('/cart', cartRoutes)
}

main();

app.listen(process.env.PORT || 3000, () => {
  console.log("Server has started");
});