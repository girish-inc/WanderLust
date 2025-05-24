const express= require("express");
const router=express.Router({mergeParams:true});
const wrapAsync =require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js")
const {listingJoiSchema,reviewSchema}=require("../schema.js")
const Review=require("../models/review.js")
const Listing = require("../models/listing.js"); // 👈 Add this line
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js")

//controllers
const reviewController=require("../controllers/reviews.js")


//reviews
//post route
router.post("/",validateReview,wrapAsync(reviewController.createReview ))

//review delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync (reviewController.destroyReview))




module.exports=router;