"use strict";
const { parseIP } = require("../functions/api")
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
    //https://stackoverflow.com/questions/10849687/express-js-how-to-get-remote-client-address
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
    var userAgent = req.get('User-Agent');
    
    let Res = await parseIP(ip);

    if (!Res) return false
    console.log(Res)
    



});

//yaml

//text

//ip lookup

//domain lookup
// var whois = require('whois')
// whois.lookup('49.245.69.217', function(err, data) {
//     console.log(data)
//   })   
// const dns = require('node:dns');

// dns.lookup('49.245.69.217', (err, address, family) => {
//     console.log('address: %j family: IPv%s', address, family);
//   });




module.exports = router;
