const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  task: {
    type: String,
    require: [true, { message: 'escribe una tarea' }]
  },
  username: {
    type: String,
    require: [true, { message: 'nombre de usuario es requerido' }]
  },
  date: {
    type: String,
    require: true
  },
  finished: {
    type: Boolean,
    require: true
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
