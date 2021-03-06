const express = require('express');
const path = require("path");
const session = require('express-session');
const routes = require('./controllers');
const exphbs = require('express-handlebars');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const helpers = require("./utils/helper");

const hbs = exphbs.create({ helpers });
//use public folder
app.use(express.static(path.join(__dirname, "public")));
// Inform Express.js which template engine we're using
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const sess = { //create a new session Object variable
    secret: 'Super secret secret',
    cookie: {
        maxAge: 864000000, //sets the time in milliseconds for when the cookie expires
        httpOnly: true, //enforces that the cookie info only be stored
        secure: false,
        sameSite: "strict"
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess)); //tells express to use session

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //parse the urlencoded data with querystring library

app.use(routes); //use the routes

sequelize.sync({ force: false, alter: true}).then(() => { //tells sequelize to become sunchronous and to NOT delete existing tables
    app.listen(PORT, () => console.log('Now listening'));
});