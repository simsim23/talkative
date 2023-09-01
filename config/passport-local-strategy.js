const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// authentication using password
passport.use(new LocalStrategy({
    usernameField : 'email',
    passReqToCallback : true
},
function(req,email,password,done){
    // find the user and establish the identity
    User.findOne({email: email},function(err,user){
        // First email is the property and second email is the value passed in the function(in above line)
        if(err){
            req.flash('error',err);
            // console.log('Error in finding user!!');
            return done(err);
        }
        if(!user || user.password != password){
            req.flash('error','Invalid Username/Password');
            // console.log('Invalid username/password');
            return done(null,false);
        }
        return done(null,user);
    });
}));

// Serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done){
    done(null,user.id);
});

// Deserializing the user from the key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('Error in finding user!!');
            return done(err);
        }
        
        return done(null,user);
    });
});

// Check if the user is authenticated 
passport.checkAuthentication = function(req, res, next){
    // if the user is signed in, pass the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }

    // if the user is not signed in 
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;