require("dotenv").config();
const express = require("express");
const app = express();
const flash = require("connect-flash");
const session = require("express-session");
//const passport = require("passport");
const passport = require("./config/passport-config");
const isLoggedIn = require("./middleware/isLoggedIn");

const SECRET_SESSION = process.env.SECRET_SESSION;
const PORT = process.env.PORT || 3000;


//import models
const { User } = require("./models");


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false}));
app.use(express.static(__dirname + "/public"));
app.use(session({
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

//intialize passport
app.use(passport.initialize());
app.use(passport.session());

// middleware for tracking users and alerts
app.use((req, res, next)=> {
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next(); //going to the route
});

app.get("/", (req, res) => {
    res.render("home", {});
})

// im port auth routes
 app.use("/auth", require("./controllers/auth"));
// app.use("/pokemon", isLoggedIn, require("./controllers/pokemon"))

//--Authenticated route----go to user profille page--
app.get("/profile", isLoggedIn, (req, res) => {
   const { name, email, phone } = req.user;
   res.render("profile", { name,email,phone})
})

//any autehenticated route will need to have isLoggedIn before controller

// app.get("/pokemon", isLoggedIn, (req,res)=> {
    //get data
    //render page + send data to page
// })

//aap.get("/pokemon/:id/edit", isLoggedIn, (req,res)=> {})
//app.delete("/pokeon/:id", isLoggedIn, (req,res)=> {})



const server = app.listen(PORT, () => {
    console.log("You are listening on PORT", PORT);
})

module.exports = server;