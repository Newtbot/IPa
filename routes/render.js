"use strict";
var router = require("express").Router();

//landing page of index
router.get("/", function (req, res, next) {
	res.render("index");
});



module.exports = router;