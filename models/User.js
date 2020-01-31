const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        require: [true, { message: "nombre de usuario es requerido" }]
    },
    email: {
        type: String,
        require: [true, { message: "email es requerido" }]
    },
    password: {
        type: String,
        require: [true, { message: "contraseña es requerido" }]
    },
    name: {
        type: String,
        require: [true, { message: "nombre es requerido" }]
    },
    notes: {
        type: String
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
