// middleware.js
const Listing=require("./modules/listing.js");
const Review=require("./modules/review.js");
const ExpressError=require("./utils/Expresserror.js");
const {listingSchema}=require("./schema.js");
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated())
     {
      req.session.redirectUrl=req.originalUrl;
      req.flash("error", "You must be logged in to create listings");
      res.redirect("/login");
    }
    next();
  };

  module.exports.savedRedirectUrl=(req,res,next)=>
  {
    if(req.session.redirectUrl)
    {
      res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
  }

  module.exports.isowner=async(req,res,next)=>
  {
    let { id } = req.params;
    let listing = await Listing.findById(id);
if (!listing || !listing.owner || !listing.owner.equals(res.locals.curruser._id)) {
  req.flash("error", "You are not the owner");
  return res.redirect(`/listings/${id}`);
}
next();

  };
  module.exports.validatelisting=((req,res,next)=>
  {
      let {error}=listingSchema.validate(req.body);
          if(error)
          {
              let errmsg=error.details.map((el)=>el.message).join(".");
              throw new ExpressError(404,errmsg);
          }else{
              next();
          }
  })
  module.exports.isauthor=async(req,res,next)=>
  {
    let { reviewId } = req.params;
    let review = await Review.findById(reviewId);
if ( !review.author.equals(res.locals.curruser._id)) {
  req.flash("error", "You are not the owner of the review");
  return res.redirect(`/listings`);
}
next();
  }