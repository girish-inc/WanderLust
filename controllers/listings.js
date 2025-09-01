const Listing=require("../models/listing")


module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }

module.exports.filterByCategory=async (req, res) => {
    const { category } = req.params;
    const filteredListings = await Listing.find({ category: category });
    res.render("listings/index.ejs", { allListings: filteredListings });
  }

module.exports.searchListings=async (req, res) => {
    const { q } = req.query;
    let searchResults = [];
    
    if (q && q.trim() !== '') {
      const searchQuery = q.trim();
      searchResults = await Listing.find({
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { location: { $regex: searchQuery, $options: 'i' } },
          { country: { $regex: searchQuery, $options: 'i' } }
        ]
      });
    }
    
    res.render("listings/index.ejs", { allListings: searchResults });
  }

// API endpoint for filtered listings
module.exports.getFilteredListingsAPI = async (req, res) => {
    const { category } = req.params;
    
    try {
        const allListings = await Listing.find({ category: category });
        res.json({ success: true, listings: allListings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// API endpoint for all listings
module.exports.getAllListingsAPI = async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.json({ success: true, listings: allListings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports.renderNewForm=(req, res) => {
  res.render("listings/new.ejs");
}  

module.exports.showListing=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: { path: "author" },
  })
  .populate("owner");
  if(!listing){
    req.flash("error","Listing Does not Exist!");
    res.redirect("/listings") 
  }
  res.render("listings/show.ejs", { listing });
}

module.exports.createListing=async(req, res,next) => {
  let url =req.file.path;
  let filename=req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  newListing.image={url,filename};
  await newListing.save();
  req.flash("success","new Listing Created");
  res.redirect("/listings");
}

module.exports.renderEdit=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you requested for does not exist!");
    req.redirect("/listings")
  }
  let originalImageUrl=listing.image.url;
  originalImageUrl.replace("/upload","/upload/w_250");
  res.render("listings/edit.ejs", { listing,originalImageUrl});
}

module.exports.updateListing=async (req, res) => {
  let { id } = req.params;
  let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if(typeof req.file !=="undefined"){
    let url =req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
  }
  
  req.flash("success","Listing Updated Sucessfully!")
  res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted!")
  res.redirect("/listings");
}