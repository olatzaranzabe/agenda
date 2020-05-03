const express = require('express');
const router = express.Router();
const Task = require('../../models/Task');
const User = require('../../models/User');
const mongoose = require('mongoose');
const { isAutenticated } = require('../../middlewares/authentication');
// const passport = require("passport");

router.get('/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const taskList = await Task.find({ username: username.slice(1) });

    res.send({ taskList });
  } catch (error) {
    console.log(error);
  }
});
router.post('/', async (req, res) => {
  const { username, date, finished, task, id } = req.body;
  const taskdata = { username, date, finished, task, id };

  try {
    if (id.length > 0 && task.length === 0) {
      const taskFindDB = await Task.findByIdAndDelete(id);
      await console.log('borrar', taskFindDB);
      res.status(200).json({ taskFindDB });
    } else if (id.length > 0) {
      const taskFindDB = await Task.findByIdAndUpdate(id, {
        task: task,
        finished: finished
      });
      await console.log('sobre', taskFindDB);
      res.status(200).json({ taskFindDB });
    } else {
      const taskInfo = new Task({ username, date, finished, task });
      console.log('guardado', taskInfo);
      const taskDB = await taskInfo.save();

      res.status(200).json({ taskDB });
    }
  } catch {
    console.log(error);
    return res.render('/', {
      message: 'no se ha podido guardar la tarea'
    });
  }

  // try {
  //   const taskInfo = new Task({ username, date, finished, task });
  //   console.log('guardado', taskInfo);
  //   const taskDB = await taskInfo.save();

  //   res.status(200).json({ taskDB });
  // } catch (error) {
  //   console.log(error);
  //   return res.render('home', {
  //     message: 'no se ha podido guardar la tarea'
  //   });
  // }
  // if (id.length < 2 || id === undefined) {
  //   try {
  //     console.log('vemos', id.length);
  //     const taskFindDB = await Task.findByIdAndUpdate(id, taskdata);

  //     await console.log('updated', taskFindDB);

  //     res.status(200).json({ taskFindDB });
  //   } catch (error) {
  //     console.log(error);
  //
  //   }
  // } else {
  //
  // }
});
module.exports = router;
