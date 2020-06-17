require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const passport = require('passport');
// const session = require('express-session');
const session = require('cookie-session');

const mongoose = require('mongoose');
const keys = require('./keys');

var indexRouter = require('./routes/index');

// importamos la estrategia local
const LocalStrategy = require('passport-local').Strategy;

// Importamos la estrategia json web token
const JwtStrategy = require('passport-jwt').Strategy;

// Importamos la funcionalidad para descomoprimir el token.
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
  // La estrategía local recibe un primer parametro de configuración y un callback de verificación como segundo parametro
  new LocalStrategy(
    {
      // Los campos usernameField y passwordField, servirán para definir
      // el nombre de los atributos por los que encontraremos y comprobaremos al usuario
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
        /*Si no hay usuario enviamos ejecutamos next con el primer parametro (error) a null, el segundo parametro 
         (data, en este caso usuario) a false y el tercer parametro (info) con el mensaje de error*/
        if (!user) next(null, false, { message: 'El usuario no existe' });

        // comprobamos la contraseña y procedemos igual que si no hay usuario
        if (!bcrypt.compareSync(password, user.password))
          next(null, false, { message: 'la contraseña no es correcta' });

        // Si el usuario existe y la contraseña es correcta, lo enviamos como segundo parametro de la función next.
        next(null, user);
      } catch (error) {
        //Si hay un error, lo envíamos como primer parametro de la función next.
        next(error);
      }
    }
  )
);
// 3. Tras esta función definiremos la ruta login (ir a ./routes/auth/login para continuar)

// 4. DEFINIMOS LA CONFIGURACIÓN DE LA ESTRATEGIA JWT
const opts = {
  // Especificamos de donde queremos extraer el token. En este caso de los headers como Bearer token
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // Señalamos el SECRET para comprobar que el token es correcto.
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

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', require('./routes/auth'));

// app.set('views', __dirname + '/views'); // general config
// app.set('view engine', 'hbs');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({ message: 'Not found' });
});

mongoose
  .connect(process.env.DB_ROUTE, {
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
