const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");

router.get("/", (req, res) => {
    res.render("auth/signup");
});

router.post("/", async (req, res) => {
    const { username, password, email, name } = req.body;
    console.log("entra");
    try {
        const userUsername = await User.findOne({ username });
        console.log(userUsername);

        if (userUsername)
            return res.render("signup", { error: "el usuario ya existe" });

        // const userEmail = await User.findOne({ email });
        // console.log(userEmail);

        // if (userEmail)
        //     return res.render("signup", {
        //         error: "el email ya está registrado"
        //     });
        console.log(name);

        if (!name || !username || !email || !password)
            return res.render("signup", {
                error: "Rellena todos los campos!"
            });

        console.log("try");
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
        console.log(error);

        return res.render("signup", { message: "Hubo un error" });
    }
});

module.exports = router;
