const express= require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const path = require("path");
const {listingJoiSchema,reviewSchema}=require("../schema.js")
const wrapAsync =require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js")
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")

//controllers
const listingController=require("../controllers/listings.js")

//listing validated


//Index Route
router.get("/",wrapAsync( listingController.index));

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//Show Route
router.get("/:id", wrapAsync(listingController.showListing));

//Create Route
router.post("/", isLoggedIn,validateListing, wrapAsync(listingController.createListing) );


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync( listingController.renderEdit));

//Update Route
router.put("/:id", isLoggedIn,isOwner,validateListing,wrapAsync( listingController.updateListing));

//Delete Route
router.delete("/:id", isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports=router;