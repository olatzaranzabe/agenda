const express = require("express");
const router = express.Router();
const Note = require("../../models/Note");
const User = require("../../models/User");
const mongoose = require("mongoose");
const isAuthenticated = require("../../middlewares/isUserActive");
// const passport = require("passport");

router.get("/", isAuthenticated, (req, res) => {
    res.render("auth/home");
});

router.post("/", async (req, res) => {
    const { username, date, finished, public, position } = req.body;

    try {
        Note.find()
            .then(notes => {
                return res.send(notes);
                res.render("auth/login", { error: req.flash("error")[0] });
            })
            .catch(error => {
                return res
                    .status(500)
                    .send({ message: "no se pueden cargar las notas" });
            });
    } catch (error) {
        console.log("error find notes");
    }
    try {
    } catch (error) {
        console.log(error);
    }
    //Create a note
    try {
        const userUsername = await User.findOne({ username });
        console.log("hi", userUsername);

        if (userUsername)
            return res.render("signup", { error: "el usuario ya existe" });

        console.log("name", name);

        if (!task) {
            const notTask = await Note.findByIdAndRemove();
        }

        const note = new Note({
            username,
            password: hashPass,
            email,
            name
        });

        await note.save();
        console.log("note", note);
        //return res.redirect("/auth/login");
    } catch (error) {
        console.log(error);

        return res.render("home", {
            message: "no se ha podido guardar la tarea"
        });
    }
});
module.exports = router;
