const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// 3. Definimos la ruta login para devolver el token al usuario
router.post('/', (req, res) => {
  // procedemos a autenticar la estrategia local
  passport.authenticate('local', { session: false }, (error, user, info) => {
    console.log(
      `Auth estrategia local. Información recibida: error: ${error}, user: ${user}, info: ${info}`
    );

    if (error) {
      return res.status(500).json({ message: 'Hubo un error' });
    }

    if (info) {
      return res.status(400).json({ message: info });
    }

    const payload = {
      // Declaramos la id de usuario, para poder acceder a ella más tarde(En el punto 4)
      sub: user._id,
      // Definimos el tiempo de expiración
      exp: Date.now() + parseInt(process.env.JWT_EXPIRES),

      //Enviamos información útil adicional
      username: user.username
    };

    // Haciendo uso de la librería jsonwentoken generamos el token:
    // como primer parametro recibe el payload en formato string (por lo que hay que "stringifycarlo")
    // como segundo parámetro, recibe el SECRET también en formato de string. Lo recogemos del archivo .env
    const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET);
    const username = user.username;
    return res.status(200).json({ data: { token }, username: { username } });
  })(req, res);
});

module.exports = router;
