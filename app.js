const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync =require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js")
const {listingJoiSchema,reviewSchema}=require("./schema.js")
const session =require("express-session")
const flash=require("connect-flash")
const passport= require("passport");
const LocalStratergy =require("passport-local");
const User=require("./models/user.js")

const listingsRouter=require("./routes/listing.js")
const reviewsRouter=require("./routes/review.js")
const userRouter= require("./routes/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const sessionOptions={
  secret:"mysupersecretsession",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24 *60 *60* 1000,//set in miliseconds
    maxAge: 7 * 24 *60 *60* 1000,
    httpOnly:true
  }
}

app.use(session(sessionOptions));
app.use(flash())//before the routes

app.use(passport.initialize());//middleware that initaialize passport
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use((req, res, next) => {
  res.locals.success = req.flash('success') || [];
  res.locals.error = req.flash('error') || [];
  res.locals.currUser=req.user;
  next();
});



//index route
app.use("/listings",listingsRouter);
//review route
app.use("/listings/:id/reviews", reviewsRouter);
//user signup roter
app.use("/", userRouter);

//user signup roter



app.get("/demouser",async(req,res)=>{
  let fakeUser=new User({
    email:"student@gmail.com",
    username:"student1"
  })
  let registeredUser=await User.register(fakeUser,"helloworld");
  res.send(registeredUser);
})

//if not match with nothing
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found"))
})

//middleware
app.use((err,req,res,next)=>{
  let { StatusCode=500,message="something went wrong"}=err;
  res.status(StatusCode).render("Error.ejs",{err});
  // res.status(StatusCode).send(message);
})

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});