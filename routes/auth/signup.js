const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
  res.render('auth/signup');
});

router.post('/', async (req, res) => {
  const { username, password, email, name } = req.body;

  try {
    const userUsername = await User.findOne({ username });

    const userEmail = await User.findOne({ email });

    if (userUsername | userEmail) {
      return res.message({ message: 'ya estás registrado' });
    }

    if (!name || !username || !email || !password)
      return res.render({
        error: 'Rellena todos los campos!'
      });

    const hashPass = bcrypt.hashSync(password, 10);

    const user = new User({
      username,
      password: hashPass,
      email,
      name
    });

    await user.save();
    console.log(user);

    return res.status(201).json(user);
    // res.redirect('login');
    //res.json({ message: 'ok' });
    //res.redirect('/login', { message: 'login con tu nuevo user' });
  } catch (error) {
    console.log(error);

    return res.status(404).json('Hubo un error');
  }
});

module.exports = router;
