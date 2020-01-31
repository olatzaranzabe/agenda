const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    task: {
        type: String,
        require: [true, { message: "escribe una tarea" }]
    },
    username: {
        type: String,
        require: [true, { message: "nombre de usuario es requerido" }]
    },
    date: {
        type: String,
        require: true
    },
    finished: {
        type: Boolean,
        require: true
    },
    public: {
        type: Boolean
    },
    position: {
        type: Number,
        require: true
    }
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
