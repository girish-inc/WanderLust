const express= require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const path = require("path");
const {listingJoiSchema,reviewSchema}=require("../schema.js")
const wrapAsync =require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js")
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")
const multer  = require('multer')

const {storage}=require("../cloudConfig.js")
const upload = multer({ storage }) 


//controllers
const listingController=require("../controllers/listings.js")

//listing validated
router
  .route("/")
  .get(wrapAsync( listingController.index))//index route
  .post(isLoggedIn, upload.single("listing[image][url]"),validateListing,wrapAsync(listingController.createListing) );//create route


//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);


router
  .route("/:id") 
  .get( wrapAsync(listingController.showListing))//show route 
  .put(isLoggedIn,isOwner,upload.single("listing[image][url]"),validateListing,wrapAsync( listingController.updateListing))//update route
  .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))//delet route


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync( listingController.renderEdit));


module.exports=router;