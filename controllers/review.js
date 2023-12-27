const listing=require("../modules/listing.js");
const Review=require("../modules/review.js");


module.exports.createreview=async(req,res)=>
{
   
   let listing1=await listing.findById(req.params.id);
   let newreview=new Review(req.body.review);
   newreview.author=req.user._id;
   listing1.reviews.push(newreview);
   await newreview.save();
   await listing1.save();
   req.flash("success","new review created");
   res.redirect(`/listings/${listing1._id}`)
};

module.exports.destroyeview=async(req,res)=>
{
    let{id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted");
    res.redirect(`/listings/${id}`);
};