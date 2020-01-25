const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema({
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
        require: [true, { message: "contraseña es requerido" }]
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
