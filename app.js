require("dotenv").config();  // Dette indlæser .env-filen

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const userRoute = require("./routes/userRoute");

const port = process.env.PORT || 3000;
const dbConnectionString = process.env.DB_CONNECTION_STRING;

const app = express();

// Middleware til at parse request body og håndtere sessions
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(session({
    secret: "hemmeligNøgle",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Mongoose connection
mongoose.connect(dbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB Atlas!');
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Stop appen, hvis der er fejl
});

app.use(userRoute);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/dashboard", (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/login");
    }
    res.render("dashboard", { username: req.session.username });
});

app.listen(3000, () => {
    console.log("Serveren kører på http://localhost:3000");
});
