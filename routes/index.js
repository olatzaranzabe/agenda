var express = require('express');
var router = express.Router();
const { isAutenticated } = require('../middlewares/authentication');

router.get('/', isAutenticated, (req, res, next) => {
  res.json({ message: 'Autorizado' });
});

module.exports = router;
