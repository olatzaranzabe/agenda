const express = require("express");
const router = express.Router();

router.use("/signup", require("./signup"));
router.use("/login", require("./login"));
router.use("/logout", require("./logout"));
router.use("/home", require("./home"));

module.exports = router;
