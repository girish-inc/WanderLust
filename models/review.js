// const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema =Schema({
    comment:{
        type:String,
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now(),//set the current date and time
    },author:{
        type:String,
        ref:"User"
    }

})

module.exports=mongoose.model("Review",reviewSchema);