const express=require("express");
const router=express.Router();
const wrapasync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/Expresserror.js");
const {listingSchema}=require("../schema.js");
const listing=require("../modules/listing.js");
const {isLoggedIn} = require("../middleware.js");
const {isowner,validatelisting}=require("../middleware.js");
const listingcontroller=require("../controllers/listing.js");

const multer  = require('multer')
const {storage}=require("../cloud.js");
const upload = multer({storage})
///routes are working from controllers
//index
// router.get("/", wrapasync(listingcontroller.index)); orginal one after it modified to routes
router.route("/")
.get(wrapasync(listingcontroller.index))
//crrate route
.post(isLoggedIn,upload.single("listing[image]"),
 validatelisting,wrapasync(listingcontroller.create)); 

//new route
// new route
router.get("/new", isLoggedIn,listingcontroller.new);

//router demos using routes
router.route("/:id")
//show route
.get(wrapasync(listingcontroller.show))
//update route
.put(isLoggedIn,isowner,upload.single("listing[image]"),
   validatelisting, wrapasync(listingcontroller.update))
   //delete route
.delete(isLoggedIn,wrapasync(listingcontroller.delete));
 
  //edit route
  router.get("/:id/edit",isowner,isLoggedIn,wrapasync(listingcontroller.edit));



module.exports=router;
//review test
