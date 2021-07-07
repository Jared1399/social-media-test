const colors = require('colors');
const morgan = require('morgan');
const express = require('express');
const app = express();const fetch = require('node-fetch');
const db = require('./database');
const bodyParser = require('body-parser');

const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passportLocal = require('passport-local').Strategy;


//settings
db.connect();
app.set('appName','Social Media Test');
app.set('port',3010);
app.set('view engine','ejs');
app.listen(app.get('port'), ()=>{
    console.log('Server on port'.trap.red ,app.get('port'));
})


//middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use('/public', express.static('public'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

//authentication
app.use(cookieParser('MiSecreto'));
app.use(session({
    secret: 'MiSecreto',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal(function(username, password, done){

    db.query("SELECT * FROM `users` WHERE `name` = '" + username + "'", function(err,rows){

        if (err)
            return done(err);
         if (!rows.length) {
            return done(null, false); 
        } 

        if (!( rows[0].password == password)){
            return done(null, false); 
            res.redirect('/login');
        }    
        return done(null, rows[0]);	

    });

}));

passport.serializeUser(function(user, done){
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    db.query("SELECT * FROM `users` WHERE `id` = '" + id + "'", function(err,rows){ 
        if(err)
            return done(err);
        
        return done(null, rows[0]);	
    });
});


//routes

/*get contacts
    var a = "[]";
    a = a.replace(/'/g, '"');
    a = JSON.parse(a);
    a.push(0)
    console.log(a)
*/

app.get('/', (req, res, next)=>{

    if(req.isAuthenticated()) return next(); 
    
    res.redirect('/login');

} ,function (req,res) {

    res.render('index.ejs');
    
})


app.get('/login', function (req,res) {
     
    res.render('login.ejs');
    
})


app.post('/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login'
}))


app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
});


app.get('/register', function (req,res) {
     
    res.render('register.ejs');
    
})


app.all('/user', (req,res,next) => {
    console.log('el barto was here');
    next();
})


app.get('/user/list', (req, res, next)=>{

    if(req.isAuthenticated()) return next(); 
    
    res.redirect('/login');

},(req,res) => {
    
    fetch('https://swapi.dev/api/people/')
        .then(res => res.json())
        .then(data => { 
            res.send(JSON.stringify(data.results))
        });
})


app.get('/user/profile', (req, res, next)=>{

    if(req.isAuthenticated()) return next(); 
    
    res.redirect('/login');

} ,function (req,res) {

    let userData = req.user;

    console.log(userData);

    res.render('userProfile.ejs',{user : userData}); 
})


app.post('/user/register/:username&:password',(req,res) => {

    res.setHeader('Content-Type', 'application/json');
    
    let post = {
        name: req.body.username,
        password: req.body.password
    }

    let sql = `INSERT INTO users (name, password) VALUES ("${post.name}","${post.password}")`;

    db.query(sql, post, (err, res) => {
        if(err) throw err;
        console.log('success');
        console.log(res);
    });

    res.redirect("/");
})


app.delete('/user/:userId',(req,res) => {
    res.send(`User ${req.body.userId} deleted`);
})


app.put('/user/:userId',(req,res) => {
    res.send(`User ${req.body.userId} updated`);
})


app.use(function(error,req, res, next) {
    res.status(404).send('Sorry cant find that!');
});
