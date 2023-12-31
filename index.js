const express = require('express');
const env = require('./config/environment');
require('dotenv');
const app = express();
require('./config/view-helpers')(app);
const port = process.env.PORT|| 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');
// used for session-cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
// const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

// Setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(3000);
console.log('Chat server is listening on port 3000');
const path = require('path');

// app.use(sassMiddleware({
//     src : path.join(__dirname, env.asset_path, 'scss'),
//     dest : path.join(__dirname, env.asset_path, 'css'),
//     debug : true,
//     outputStyle: 'extended',
//     prefix : '/css'
// }));

app.use(express.urlencoded());
app.use(cookieParser());

app.use(expressLayouts);

app.use(express.static(env.asset_path));
// app.use(express.static('./assets'));
// makes the upload path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

// set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

// MongoStore is used to store the session cookie in the db
app.use(session({
    name : 'codeial',
    secret : env.session_cookie_key,
    saveUninitialized : false,
    resave : false,
    cookie : {
        maxAge : (1000 * 60 * 100)
    },
    store : new MongoStore(
        {
            mongoUrl : 'mongodb://localhost/codeial_development',
            autoRemove : 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// Sincce it uses session-cookie, it should be placed after that
app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use('/',require('./routes'));

app.listen(port,function(err){
    
    if(err) console.log(`Error in running the server : ${err}`); // Interpolation
    else console.log(`Server is running on port : ${port}`);
});