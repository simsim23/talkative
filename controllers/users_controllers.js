const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function(req,res){
    // res.end('<h1>User Profile</h1>');
    User.findById(req.params.id,function(err,user){
        console.log(user);
        res.render('user_profile',{
            title : 'User-Profile',
            profile_user : user
        });
    })
}

module.exports.update = async function(req,res){
    // if(req.user.id == req.params.id){
    //     // {name: req.body.name , email : req.body.email} can be replaced by req.body
    //     User.findByIdAndUpdate(req.params.id,{name: req.body.name , email : req.body.email},function(err,user){
    //         return res.redirect('back');
    //     });
    // }
    // else{
    //     req.flash('error','Unauthorized');
    //     return res.status(401).send('Unauthorized');
    // }
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err) console.log('Multer error : ',err);
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){

                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }

                    // This is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }
        catch(err){
            req.flash('error',err);
            return req.redirect('back');
        }
    }
    else{
        req.flash('error','Unauthorized');
        return res.status(401).send('Unauthorized');
    }
}

// render signUp page
module.exports.signUp = function(req,res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    res.render('user_sign_up',{
        title : 'User-Sign-Up'
    })
}

// render signIn page
module.exports.signIn = function(req,res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    
    res.render('user_sign_in',{
        title : 'User-Sign-In'
    })
}

// get the signUp data
module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email: req.body.email},function(err,user){
        if(err){
            console.log('Error in finding user in Signing Up');
            return;
        }
        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    console.log('Error in creating user while Signing Up');
                    return;
                }
                return res.redirect('/users/sign-in');
            });
        }
        else{
            return res.redirect('back');
        }
    });
}

// Sign In  and create session for the user
module.exports.createSession = function(req,res){
    req.flash('success','Logged In Succesfully!!');
    return res.redirect('/');
}

module.exports.destroySession = function(req,res){
    req.logout(function(err) {
        if (err) return err;
        req.flash('success','You have Logged Out!!');
        return res.redirect('/');
    });
}