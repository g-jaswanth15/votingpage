const express = require('express')
const mongoose = require('mongoose')
const expressLayouts =  require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')
const app = express()

// Passport 
require('./passportaut/pass')(passport);


//connecting to database
const dbURI = 'mongodb+srv://delta-task:delta3@cluster0.jo6mm.mongodb.net/dleta?retryWrites=true&w=majority'
mongoose.connect(dbURI,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})
.then(()=>console.log('mongodbconnected..'))

//insert css file
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))

//EJS
app.use(expressLayouts)
app.set('view engine','ejs')

//express-session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

// Passport 
app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash())

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

app.listen(3000)

//routes
const some = require('./routes/index')
app.use('/',some.router)