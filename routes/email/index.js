const express = require("express");
const router = express.Router();

router.use("/send", require("./sendEmail"));

module.exports = router;
