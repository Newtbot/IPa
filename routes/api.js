"use strict";
const { 
    parseIP, 
    parseUserAgent, 
    parseDomain,
    parseYAML,
} = require("../functions/api");
const express = require("express");
const router = express.Router();


/*
Note:
? is a null check operator
?? is a null check operator that returns the right hand side if the left hand side is null
*/
//json
router.use("/json", async (req, res, next) => {
	try {
		//https://stackoverflow.com/questions/10849687/express-js-how-to-get-remote-client-address
		var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
		var userAgent = req.get("User-Agent");

		let Res = await parseIP("49.245.96.142");
        // let Res = await parseIP(ip);

        let browserRes = await parseUserAgent(userAgent);
        if (!browserRes) return false;
		if (!Res) return false;
		res.json({
            ip: ip,
			asn_no: Res.ASN?.autonomous_system_number,
			asn_org: Res.ASN?.autonomous_system_organization,
			country: Res.city?.country?.names?.en ?? Res.city?.country?.iso_code ?? "N/A",
			city: Res.city?.city?.names?.en ?? "N/A",
			hostname: Res.hostname ? Res.hostname[0] : "N/A",
            browser: browserRes.name ?? "Unknown Browser", 
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
});

//full json with language
router.use("/fulljson", async (req, res, next) => {
	try {
		//https://stackoverflow.com/questions/10849687/express-js-how-to-get-remote-client-address
		var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
		var userAgent = req.get("User-Agent");

		// let Res = await parseIP("49.245.96.142");
        let Res = await parseIP(ip);
        let browserRes = await parseUserAgent(userAgent);
        if (!browserRes) return false;
		if (!Res) return false;
		res.send({ Res, browserRes });
	} catch (error) {
		console.log(error);
		next(error);
	}
});

//yaml
router.use("/yaml", async (req, res, next) => {
	try {
		//https://stackoverflow.com/questions/10849687/express-js-how-to-get-remote-client-address
		var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
		var userAgent = req.get("User-Agent");

		// let Res = await parseIP("49.245.96.142");
        let Res = await parseIP(ip);
        let browserRes = await parseUserAgent(userAgent);
        if (!browserRes) return false;
		if (!Res) return false;
        let yamlRes = await parseYAML({ 
            ip: ip,
            asn_no: Res.ASN?.autonomous_system_number,
            asn_org: Res.ASN?.autonomous_system_organization,
            country: Res.city?.country?.names?.en ?? Res.city?.country?.iso_code ?? "N/A",
            city: Res.city?.city?.names?.en ?? "N/A",
            hostname: Res.hostname ? Res.hostname[0] : "N/A",
            browser: browserRes.name ?? "Unknown Browser",
        });
        res.set('Content-Type', 'text/yaml');
        res.send(yamlRes);
	} catch (error) {
		console.log(error);
		next(error);
	}
});

//text
router.use("/text", async (req, res, next) => {
	try {
		//https://stackoverflow.com/questions/10849687/express-js-how-to-get-remote-client-address
		var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
		var userAgent = req.get("User-Agent");

		// let Res = await parseIP("49.245.96.142");
        let Res = await parseIP(ip);
        let browserRes = await parseUserAgent(userAgent);
        if (!browserRes) return false;
		if (!Res) return false;
        res.set('Content-Type', 'text/plain');
        res.send({ 
            ip: ip,
            asn_no: Res.ASN?.autonomous_system_number,
			asn_org: Res.ASN?.autonomous_system_organization,
			country: Res.city?.country?.names?.en ?? Res.city?.country?.iso_code ?? "N/A",
			city: Res.city?.city?.names?.en ?? "N/A",
			hostname: Res.hostname ? Res.hostname[0] : "N/A",
            browser: browserRes.name ?? "Unknown Browser",
        });
	} catch (error) {
		console.log(error);
		next(error);
	}
});

//user agent
router.use("/useragent", async (req, res, next) => {
    try {
        var userAgent = req.get("User-Agent");
        if (!userAgent) return false;
        res.json({
            useragent: userAgent,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

//domain lookup
router.use("/domain/:domain", async (req, res, next) => {
    const domain = req.params.domain;
    if (!domain) return res.json({
        error: "No domain name provided",
    })
    try {
        let Res = await parseDomain(domain);
        if (!Res) return false;
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(Res, null, 4));


    } catch (error) {
        console.log(error);
        next(error);
    }
});

//ip lookup
router.use("/:ip", async (req, res, next) => {
    const ip = req.params.ip;
    if (!ip) return res.json({
        error: "No IP address provided",
    })
    try {
        let Res = await parseIP(ip);
        if (!Res) return false;
        res.json({
            ip: ip,
            asn_no: Res.ASN?.autonomous_system_number,
            asn_org: Res.ASN?.autonomous_system_organization,
			country: Res.city?.country?.names?.en ?? Res.city?.country?.iso_code ?? "N/A",
            city: Res.city?.city?.names?.en ?? "N/A",
            hostname: Res.hostname ? Res.hostname[0] : "N/A",
            timezone: Res.city?.location?.time_zone ?? "N/A",
            location: {
                latitude: Res.city?.location?.latitude ?? "N/A",
                longitude: Res.city?.location?.longitude ?? "N/A",
            },
        });
    } catch (error) {
        console.log(error);
        next(error);
    }

});

module.exports = router;
