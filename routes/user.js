const express=require("express");
const router=express.Router({mergeParams:true});
const User=require("../modules/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {savedRedirectUrl}=require("../middleware.js");
const usercontroller=require("../controllers/user.js");


router.route("/signup")
.get(usercontroller.rendersignupform)
.post(wrapAsync(usercontroller.signup));


router.route("/login")
.get(usercontroller.renderloginform)
.post(savedRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),usercontroller.login);
//orginal one then changed by router.route
// router.post("/login",savedRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),usercontroller.login);
//passport provides passport function
router.get("/logout",usercontroller.logout);
module.exports=router;