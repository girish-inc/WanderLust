const User=require("../models/user.js");


module.exports.renderSignupForm=(req,res) => {
    res.render("./users/signup")
}

module.exports.signup=async(req,res) => {
    try{
        let{username,email,password}=req.body;
        const user= new User({email,username});
        const registeredUser=await User.register(user,password );
        req.login(registeredUser,(err) =>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Stay-Ease")
            res.redirect("/listings")
        })
    }catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm=(req,res) =>{
    res.render("./users/login.ejs")
}

module.exports.login=async (req,res) =>{
    req.flash("success","Welcome Back Again")
    // console.log(res.locals.redirectUrl)
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next) => {
    req.logout((err)=>{
        if(err){
           return next(err)
        }
        req.flash("success","you are logged out!!")
        res.redirect("/listings");
    })
}