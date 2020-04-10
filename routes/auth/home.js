const express = require('express');
const router = express.Router();
const Task = require('../../models/Task');
const User = require('../../models/User');
const mongoose = require('mongoose');
// const passport = require("passport");

router.get('/', async (req, res) => {
  try {
    const taskList = await Task.find({ username: 'x' });
    res.send({ taskList });
  } catch (error) {
    console.log(error);
  }
});
router.post('/', async (req, res) => {
  const { username, date, finished, task } = req.body;
  await console.log(req.body);

  try {
    const taskInfo = new Task({ username, date, finished, task });
    console.log(taskInfo);

    const taskDB = await taskInfo.save();

    res.status(200).json({ taskDB });
  } catch (error) {
    console.log(error);
    return res.render('home', {
      message: 'no se ha podido guardar la tarea'
    });
  }

  //   // // //   try {
  //   // // //     Note.find()
  //   // // //       .then(notes => {
  //   // // //         return res.send(notes);
  //   // // //          res.render('auth/login', { error: req.flash('error')[0] });
  //   // // //       })
  //   // // //       .catch(error => {
  //   // // //         return res
  //   // // //           .status(500)
  //   // // //           .send({ message: 'no se pueden cargar las notas' });
  //   // // //       });
  //   // // //   } catch (error) {
  //   // // //     console.log('error find notes');
  //   // // //   }
  //   // // //   try {
  //   // // //   } catch (error) {
  //   // // //     console.log(error);
  //   // // //   }
});
module.exports = router;
