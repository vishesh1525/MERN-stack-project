
const listing=require("../modules/listing.js");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN;
const geocodingClient= mbxgeocoding({ accessToken:maptoken });
module.exports.index=async (req, res) => 
{
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
};
module.exports.new=(req, res) => {
    res.render("listings/new.ejs");
  };
  module.exports.create=async (req,res,next)=>
  {
    
        //  if(req.body.listing.image===""){
        //      delete req.body.listing.image;
        //  }
        let response=await geocodingClient.forwardGeocode({
          query: req.body.listing.location,
          limit: 1
        })
          .send();

       
       
        const { path, filename } = req.file;
        let newListing = new listing(req.body.listing);
    
        // Set the owner to the user's ID
        newListing.owner = req.user._id;
        
        // Set the image field as an object with the URL and filename
        newListing.image = { url: path, filename: filename };
    
        // Save the new listing to the database
        newListing.geometry=response.body.features[0].geometry;
        let savelisting=await newListing.save();
        console.log(savelisting);
         req.flash("success","new listing created");
         res.redirect("/listings");
     
  };
  module.exports.show=async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!Listing)
    {
      req.flash("error","listing which you are searching does not exist");
      res.redirect("/listings");
    }
  
    res.render("listings/show.ejs", { Listing });
  };

  module.exports.edit=async(req,res)=>
  {
    let { id } = req.params;
    const Listing = await listing.findById(id);
    if(!Listing)
    {
      req.flash("error","listing which you are searching does not exist");
      res.redirect("/listings");
    }
    let originalimageurl=Listing.image.url;
    let imageurl=originalimageurl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{Listing,imageurl});
  };

  module.exports.update=async (req, res) => {
    let { id } = req.params;
    let Listing=await listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file!=="undefined")
    {
      const { path, filename } = req.file;
      Listing.image = { url: path, filename: filename };
      await Listing.save();
    }
    
    req.flash("success","new listing updated");
    res.redirect(`/listings/${id}`);
  };
  module.exports.delete=async(req,res)=>
  {
      let { id } = req.params;
      const deleted=await listing.findByIdAndDelete(id);
      console.log(deleted); 
      req.flash("success"," listing deleted");  
      res.redirect("/listings");
      
  
  };