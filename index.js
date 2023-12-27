const {listingSchema}=require("./schema.js");
const Review=require("./modules/review.js");
const {reviewSchema}=require("./schema.js");
const wrapAsync = require("./utils/wrapAsync.js");
const listing=require("./modules/listing.js");
if(process.env.NODE_ENV!="production")
{
    require('dotenv').config()
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
// const mongo_var='mongodb://127.0.0.1:27017/wanderlust';
const dbPassword = encodeURIComponent('vishesh@15');
const db_url = `mongodb+srv://vishesh_1525:${dbPassword}@cluster0.zg2yu11.mongodb.net/?retryWrites=true&w=majority`;

const path=require("path");
const methodOverride = require("method-override");
const engine=require("ejs-mate");
const ExpressError=require("./utils/Expresserror.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const userrouter=require("./routes/user.js");
var session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport=require("passport");
const Localstrategy=require("passport-local");
const User=require("./modules/user.js");


app.engine('ejs', engine);
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const store=MongoStore.create({
    mongoUrl:db_url,
    crypto:
    {
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>
{
    console.log("Error in mongosse-connet",err);
})
const sessionOptions={store,secret:process.env.SECRET,resave:false,saveUninitialized:true,
   cookie:
{
    expires:Date.now()+1000*60*60*24*7,
    maxage:1000*60*60*24*7,
    httpOnly:true,
}};


// app.get("/",(req,res)=>
// {
//     res.send("hii");
// });
main().then(()=>
    {
       console.log("connected to db");
    })
    .catch((err)=>
    {
        console.log(err);
    })
async function main()
{
    await mongoose.connect(db_url);
}


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>
{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
})
app.get("/demouser",async(req,res)=>
{
    let fakeuser=new User({
        email:"siddulowde@gmail.com",
        username:"vishesh1",

    });
    let registreduser=await User.register(fakeuser,"helloword");
    res.send(registreduser);
});
//index route
app.use("/listings",listings);
//review test
app.use("/listings/:id/reviews",reviews)
app.use("/",userrouter);

app.all("*",(req,res,next)=>
{
    next(new ExpressError(404,"page not found"));
});
app.use((err,req,res,next)=>
{
    let{statuscode=500,message="something is not good"}=err;
    res.status(statuscode).render("error.ejs",{err});
})
app.listen(8080,()=>
{
    console.log("its working");
})


// app.get("/testlisting",async(req,res)=>
// {
//     let sampletesting=new listing({
//         title:" my neww villa",
//         description:"by the beach",
//         price:1200,
//         location:"goa",
//         country:"india"
//     });
//     await sampletesting.save();
//     console.log("sample was saved");
//     res.send("sucesfull testing");
// })