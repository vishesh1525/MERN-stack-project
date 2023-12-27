const User=require("../modules/user.js");

module.exports.signup=async(req,res)=>
{
   try{
    let{username,email,password}=req.body;
   const newUser=new User({email,username});
   const registreduser=await User.register(newUser,password);
   console.log(registreduser);
   //after signup automatically saves login
   req.login(registreduser,(err)=>
   {
       if(err)
       {
          next(err);
       }
       req.flash("success","welocme to wanderlust");
       return res.redirect("/listings");
   });
//    req.flash("success","welocme to wanderlust");
//    res.redirect("/listings");

   }catch(e)
   {
        req.flash("error","user already registered");
        res.redirect("/signup");
   }
};

module.exports.rendersignupform=(req,res)=>
{
    res.render("users/signup.ejs");
};

module.exports.renderloginform=(req,res)=>
{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>
{
    req.flash("success","welcome to wanderlust sucesfully logged in");
    let redirecturl=res.locals.redirectUrl ||"/listings";
   res.redirect(redirecturl);
};

module.exports.logout=(req,res)=>
{
    req.logout((err)=>
    {
        if(err)
        {
            next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    });
};