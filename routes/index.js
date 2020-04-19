var express = require('express');
var router = express.Router();
const { isAutenticated } = require('../middlewares/authentication');

router.get('/', isAutenticated, (req, res, next) => {
  // en caso de entrar a la función, quiere decir que el usuario esta autorizado
  res.json({ message: 'Autorizado' });
});

module.exports = router;
