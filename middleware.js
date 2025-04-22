const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError= require("./utils/ExpressError.js")
const {listingJoiSchema,reviewSchema}=require("./schema.js")


module.exports.isLoggedIn= (req,res,next) =>{
  // console.log(req.user);  
  if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;    
    req.flash("error","you must be loggedin first!");
        return res.redirect("/login")
      }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl; // optional: clear after using
  }
  next();
};

module.exports.isOwner= async(req,res,next) => {
  let{id}=req.params;
  let listing=await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not owner of Listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId).populate("author");

  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};



module.exports.validateListing=(req,res,next) =>{
    let {error}=listingJoiSchema.validate(req.body);
    if(error){
      throw new ExpressError(400,error)
    }else{
      next();
    }
  }


module.exports.validateReview=(req,res,next) =>{
      let {error}=reviewSchema.validate(req.body);
      if(error){
        throw new ExpressError(400,error)
      }else{
        next();
      }
    }