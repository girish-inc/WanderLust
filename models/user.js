const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username:{
        type:String,
        required:true
    }
});

// Fix: apply plugin to userSchema, not 'user'
userSchema.plugin(passportLocalMongoose);

// Fix: typo in 'mongoose'
module.exports = mongoose.model('User', userSchema);
