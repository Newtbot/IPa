"use strict";
var router = require("express").Router();

//landing page of index
router.get("/", function (req, res, next) {
	res.render("index");
});

router.get("/tos", function (req, res, next) {
	res.render("tos");
});

module.exports = router;