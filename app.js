require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var timeout = require('connect-timeout');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('cookie-session');

const mongoose = require('mongoose');
const keys = require('./keys');

var indexRouter = require('./routes/index');

const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const bcrypt = require('bcrypt');

const User = require('./models/User.js');
const SERVER_PORT = process.env.SERVER_PORT || 5000;
const DB_PORT = process.env.DB_PORT || 27017;
const dbROute = process.env.DB_ROUTE;

const authRouter = require('./routes');

const app = express();

const cors = require('cors');
app.use(cors());

app.use(passport.initialize());

app.use(
  session({
    secret: 'passport-authentication',
    resave: false,
    saveUninitialized: true,
    secure: true
  })
);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false
    },
    async (email, password, next) => {
      console.log(
        `Estrategia local. Información recibida: email ${email}, password${password}`
      );
      try {
        const user = await User.findOne({ email });

        await console.log(user);
        if (!user) next(null, false, { message: 'El usuario no existe' });

        if (!bcrypt.compareSync(password, user.password))
          next(null, false, { message: 'la contraseña no es correcta' });

        next(null, user);
      } catch (error) {
        next(error);
      }
    }
  )
);

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.secretOrKey
};

passport.use(
  new JwtStrategy(opts, async (tokenPayload, next) => {
    console.log(`Estrategia jwt. Información recibida: token ${tokenPayload}`);
    try {
      const user = await User.findOne({ _id: tokenPayload.sub });

      if (!user) next(null, false, { message: 'invalid token' });

      next(null, user);
    } catch (error) {
      next(error);
    }
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', require('./routes/auth'));

app.use(function(req, res, next) {
  res.status(404).json({ message: 'Not found' });
});

mongoose
  .connect(process.env.MONGODB_URI, {
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
