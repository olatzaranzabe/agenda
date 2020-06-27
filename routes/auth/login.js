const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {
  passport.authenticate('local', { session: false }, (error, user, info) => {
    console.log(
      `Auth estrategia local. Información recibida: error: ${error}, user: ${user}, info: ${info}`
    );
    console.log('error', error);
    if (error) {
      return res.status(500).json({ message: 'Hubo un error' });
    }

    if (info) {
      return res.status(400).json({ message: info });
    }

    const payload = {
      sub: user._id,
      exp: Date.now() + parseInt(process.env.JWT_EXPIRES),

      username: user.username
    };

    const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET);
    const username = user.username;
    return res.status(200).json({ data: { token }, username: { username } });
  })(req, res);
});

module.exports = router;
