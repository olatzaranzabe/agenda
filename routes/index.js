var express = require("express");
var router = express.Router();
const ensureLoggin = require("connect-ensure-login");
/* GET home page. */
router.get(
    "/",
    ensureLoggin.ensureLoggedIn("/auth/login"),
    (req, res, next) => {
        req.user;
        res.render("index", { user: req.user });
    }
);

module.exports = router;
