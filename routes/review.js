const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/Expresserror.js");
const {reviewSchema}=require("../schema.js");
const listing=require("../modules/listing.js");
const Review=require("../modules/review.js");
const {isLoggedIn,isauthor} = require("../middleware.js");
const reviewcontroller=require('../controllers/review.js');


const validatereview=((req,res,next)=>
{
    let {error}=reviewSchema.validate(req.body);
        if(error)
        {
            let errmsg=error.details.map((el)=>el.message).join(".");
            throw new ExpressError(404,errmsg);
        }else{
            next();
        }
})

router.post("/",isLoggedIn,validatereview,wrapAsync(reviewcontroller.createreview));


//delete review route
router.delete("/:reviewId",isauthor,isLoggedIn,wrapAsync(reviewcontroller.destroyeview));
module.exports=router;