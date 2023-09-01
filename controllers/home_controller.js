const Post = require('../models/post');
const User = require('../models/user');

// module.exports.home = function(req,res){
//     // return res.end('<h1>Express is up for Codeial</h1>');

//     // console.log(req.cookies);
//     // res.cookie('user_id',25);
    
//     // Post.find({},function(err,posts){
//     //     return res.render('home',{
//     //         title : 'Home',
//     //         posts : posts
//     //     });
//     // });

//     // Populate the user for each post
//     Post.find({})
//     .populate('user')
//     .populate({
//         path : 'comments',
//         populate: {
//             path : 'user'
//         }
//     })
//     .exec(function(err,posts){
//         User.find({},function(err,users){
//             return res.render('home',{
//                 title : 'Home',
//                 posts : posts,
//                 all_users : users
//             });    
//         });
//     });

// };


// Async-Await Method
try{
    module.exports.home = async function(req,res){
        // populate the user of each post
        // let posts = await Post.find({})
        // .sort('-createdAt')
        // .populate('user')
        // .populate({
        //     path : 'comments',
        //     populate: {
        //         path : 'user'
        //     },
        //     populate : {
        //         path : 'likes'
        //     }
        // }).populate('likes');
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: [
                {
                    path: 'user'
                },
                {
                    path: 'likes'
                }
            ],
            options: {
                sort: {
                    createdAt: -1
                }
            }
        })
        .populate('likes');
        // console.log(posts[0].comments);
        let users = await User.find({});
    
        return res.render('home',{
            title : 'Home',
            posts : posts,
            all_users : users
        });    
    }
}
catch(err){
    console.log('Error', err);
    return;
}