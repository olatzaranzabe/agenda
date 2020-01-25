const express = require("express");
const router = express.Router();

router.use("/calendar", require("./calendar"));

module.exports = router;
