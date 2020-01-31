var express = require("express");
var router = express.Router();
const ensureLoggin = require("connect-ensure-login");
const { isAuthenticated } = require("../middlewares/authentication");

// PAsamos el middleware como segundo parametro y desarrollamos la lógica de la función principal de la ruta index
// router.get("/", isAuthenticated, (req, res, next) => {
//     // en caso de entrar a la función, quiere decir que el usuario esta autorizado
//     res.json({ message: "Autorizado" });
// });
router.get(
    "/",
    isAuthenticated,
    ensureLoggin.ensureLoggedIn("/auth/login"),
    (req, res, next) => {
        req.user;
        res.render("home", { user: req.user });
    }
);

module.exports = router;
