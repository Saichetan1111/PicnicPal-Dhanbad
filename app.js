require('dotenv').config();




const { captureRejectionSymbol } = require('events')
const express= require('express')
const mongoose = require('mongoose')
const path=require('path')
const session = require('express-session')
const flash = require('connect-flash')
const Restaurant = require('./models/restaurant')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const { nextTick } = require('process')
const catchAsync = require('./utilities/catchAsync')
const ExpressErrors = require('./utilities/ExpressErrors')
const Joi = require('joi')
const {restaurantSchema,reviewSchema} = require('./schemas.js')
const Review = require('./models/reviews');

const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const MongoDBStore = require("connect-mongo")(session);

const restaurantsRoutes = require('./routes/restaurant')
const reviewsRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users');
const { MongoStore } = require('connect-mongo');


 const dbUrl = process.env.DB_URL
  // const dbUrl =  'mongodb://127.0.0.1:27017/food'

//  const dbUrl =  'mongodb://127.0.0.1:27017/food'

mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>{
    console.log("MONGO CONNECTION OPPEN !!!");
})
.catch(err =>{
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
})


const app=express();
app.engine('ejs',ejsMate);
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))


app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))

const store = new MongoDBStore({
    url:dbUrl,
    secret:'thisisasecret',
    touchAfter:24*60*60,
});

store.on("error",function(e){
    console.log("Session Store Error ",e);
})

const sessionConfig ={
    store,
    name:'session',
    secret : 'thisisasecret',
    resave:false,
    saveUninitialized : true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge : 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error =  req.flash('error'); 
    next();
})


app.use('/restaurants',restaurantsRoutes);
app.use('/restaurants/:id/reviews',reviewsRoutes)
app.use('/',userRoutes);

app.get('/',(req,res)=>{
    res.render('home')
})



app.all('*',(req,res,next)=>{
      next(new ExpressErrors('Page Not Found !!!! ',404))
})

app.use((err,req,res,next)=>{
    const {statusCode =500 } = err;
    if(!err.message){
          err.message = 'Some thing went wrong !!!'
    }
    res.status(statusCode).render('error',{err})
})

app.listen(3000,()=>{
    console.log('Serving on port 3000');
})
