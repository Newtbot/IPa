"use strict";
const express = require("express");
const router = express.Router();

/*
router.get("/", async (req, res, next) => {
    let Res = await getAllLog();
    res.json(Res);
});
*/
//json
router.use("/json" , async (req, res, next) => {
});

//yaml

//text

//ip lookup

//domain lookup



module.exports = router;
