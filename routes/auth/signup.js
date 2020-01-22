const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");

router.get("/", (req, res) => {
    res.render("auth/signup");
});

router.post("/", async (req, res) => {
    const { username, password, email, name } = req.body;

    try {
        console.log(username, password, email, name);
        const user = await User.findOne({ username });
        console.log(user);
        if (user)
            return res.render("signup", { error: "el usuario ya existe" });

        console.log(username, password, email, name);
    } catch (error) {
        console.log(error);

        return res.render("signup", { message: "Hubo un error" });
    }

    try {
        const hashPass = bcrypt.hashSync(password, 10);

        const user = new User({
            username,
            password: hashPass,
            email,
            name
        });

        await user.save();
        console.log(user);
        return res.redirect("/auth/login");
    } catch (error) {
        console.log("error");
        return res.render("auth/signup", { error: "Hubo un error" });
    }
});

module.exports = router;
