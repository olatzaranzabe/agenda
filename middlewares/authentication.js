var express = require('express');
var router = express.Router();
const passport = require('passport');

module.exports = {
  // 5. Definimos el middlewere que ire en la ruta a autenticar
  isAutenticated: (req, res, next) => {
    // definimos el método de autenticación como jwt, la sesión a false y el callback para gestionar la información de la estrategia jwt
    passport.authenticate('jwt', { session: false }, (error, user, info) => {
      console.log(
        `Autenticación de estrategia jwt. Información recibida: error: ${error}, user: ${user}, info: ${info}`
      );

      if (error) return res.status(500).json({ message: 'Hubo un error' });

      if (!user) return res.status(401).json({ message: 'No autorizado' });

      // Iniciamos el usuario en el objeto req para poder acceder en la función handler o principal
      req.user = user;
      // Finalizamos el middleware y pasamos a función principal (o a siguiente middleware en caso de haberlo)
      next();

      //Ejecutamos la función con req, res, next como parametros
    })(req, res, next);
  }
};
