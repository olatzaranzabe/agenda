require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");
const User = require("./models/User.js");
const SERVER_PORT = process.env.SERVER_PORT || 5000;
const DB_PORT = process.env.DB_PORT || 27017;

const LocalStrategy = require("passport-local").Strategy;
const indexRouter = require("./routes/auth/index");
const authRouter = require("./routes/auth");

const app = express();

app.use(
    session({
        secret: "passport-authentication",
        resave: true,
        saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, callback) => {
    callback(null, user);
});

passport.deserializeUser(async (id, callback) => {
    try {
        const user = await User.findById(id);
        if (!user) return callback({ message: "El usuario no existe" });

        return callback(null, user);
    } catch (error) {
        console.log(error);
        return callback(error);
    }
});

app.use(flash());

passport.use(
    new LocalStrategy(
        {
            passReqToCallback: true
        },
        async (req, username, password, next) => {
            console.log("local-str");
            try {
                const user = await User.findOne({ username });
                console.log(user);
                if (!user) {
                    console.log(null);

                    return next(null, false, {
                        message: "El usuario no existe"
                    });
                }

                if (!bcrypt.compareSync(password, user.password))
                    return next(null, false, {
                        message: "la contraseña no es correcta"
                    });

                next(null, user);
            } catch (error) {
                console.log(error);
                next(error);
            }
        }
    )
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

//app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/email", require("./routes/email"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

mongoose
    .connect(`mongodb://localhost:${DB_PORT}/miAgenda`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log(`Connected to mongo on port ${DB_PORT}`))
    .catch(err => {
        throw err;
    });

app.listen(SERVER_PORT, () => {
    console.log(`Server listening on port ${SERVER_PORT} `);
});

module.exports = app;
