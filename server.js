var express = require('express');
var mongoose = require("mongoose");
var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var ejs =require('ejs');
var engine = require('ejs-mate');

var secret = require('./config/database');
var Category = require('./models/category');
var passportConf = require('./config/passport');

var app = express();

mongoose.connect(secret.database, {useNewUrlParser: true}).then(function(){
    console.log('connected to database')
}).catch(
    function(){
        console.log('connection failed')
    }
)

//middelware
app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
  resave:true,
  saveUninitialized: true,
  secret: secret.secretKey,
  store: new MongoStore({url: secret.database, autoReconnect: true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.engine('ejs', engine);

app.set('view engine', 'ejs'); // so you can render('index')
// stuff

app.use(function(req, res, next){
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next){
    Category.find({}, function(err, categories){
      if (err) return next(err);
      res.locals.categories = categories;
      next();
    });
  });
app.get('/', function(req, res){
    res.send('<a href="/user/register">/user/register</a><br><a href="/user/login">/user/login</a><br><a href="/doctor/register">/doctor/register</a><br><a href="/doctor/login">/doctor/login</a><br><a href="/home">/dashboard</a><br><a href="/booking">/booking</a><br><a href="/category">/category</a><br><a href="/search">/search</a><br>')
});

var apiRouter = require('./api/mail');
app.use('/api', apiRouter);

var formRouter = require('./routes/forms');
app.use('/', formRouter);

var adminRouter = require('./routes/admin');
app.use('/admin', adminRouter);

var mainRouter = require('./routes/main');
app.use('/', mainRouter);

var ajaxRoute = require('./routes/ajax-filter');
app.use('/ajax/api', ajaxRoute)
var panelRoute = require('./routes/panel');
app.use('/panel',passportConf.isAuthenticated, panelRoute);
app.get('*', function(req, res){
  res.send('Page Not found 404');

});


app.listen(secret.port, () => console.log(`app listening on port: `+secret.port))