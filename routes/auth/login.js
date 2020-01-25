const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
    res.render("auth/login", { error: req.flash("error")[0] });
});

router.post(
    "/",
    passport.authenticate("local", {
        successRedirect: "/auth/home",
        failureRedirect: "/auth/login",
        failureFlash: true,
        passReqToCallback: true
    })
);

module.exports = router;
