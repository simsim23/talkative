const nodeMailer = require('../config/nodemailer');

// this is another way of exporting a method
exports.newPost = (post) => {

    let htmlString = nodeMailer.renderTemplate({post : post},'/posts/new_post.ejs');

    nodeMailer.transporter.sendMail({
        from : 'anmolgupta081202@gmail.com',
        to : post.user.email,
        subject : 'New Post Published',
        html : htmlString
    },(err,info) => {
        if(err){
            console.log('Error in sending mail',err);
            return;
        }
        console.log('Message sent', info);
        return;
    });
}