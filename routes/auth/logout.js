const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res) => {
  console.log('logout');
  req.logOut();
  res.redirect('/login');
});

module.exports = router;
