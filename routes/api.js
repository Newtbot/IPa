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

/**
 * @swagger
 * /json:
 *   get:
 *     summary: Get IP address information in JSON format
 *     description: Get IP address information in JSON format
 *     responses:
 *      200:
 *       description: Successful response with JSON output of IP address information
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             example:
 *              ip: 8.8.8.8
 *              asn_no: 15169
 *              asn_org: Google LLC
 *              country: US
 *              city: Mountain View
 *              hostname: dns.google
 *              browser: Chrome
 */
router.use("/json", async (req, res, next) => {
	try {
		//https://stackoverflow.com/questions/10849687/express-js-how-to-get-remote-client-address
		var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
		var userAgent = req.get("User-Agent");

		// let Res = await parseIP("49.245.96.142");
        let Res = await parseIP(ip);

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
/**
 * @swagger
 * /yaml:
 *   get:
 *     summary: Get IP address information in YAML format
 *     description: Get IP address information in YAML format
 *     responses:
 *      200:
 *       description: Successful response with YAML output of IP address information
 *       content:
 *         application/yaml:
 *           schema: 
 *             type: object
 *             example:
 *              ip: 8.8.8.8
 *              asn_no: 15169
 *              asn_org: Google LLC
 *              country: US
 *              city: Mountain View
 *              hostname: dns.google
 *              browser: Chrome
 */
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

/**
 * @swagger
 * /text:
 *  get:
 *   summary: Get IP address information in text format
 *   description: Get IP address information in text format
 *   responses:
 *    200:
 *     description: Successful response with text output of IP address information
 *     content:
 *       text/plain:
 *         schema:
 *           type: string
 *           example: 
 *            ip: 8.8.8.8
 *            asn_no: 15169
 *            asn_org: Google LLC
 *            country: US
 *            city: Mountain View
 *            hostname: dns.google
 *            browser: Chrome
 * 
 */
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
/**
 * @swagger
 * /useragent:
 *  get:
 *   summary: Get user agent information
 *   description: Get user agent information in JSON format
 *   responses:
 *    200:
 *     description: Successful response with JSON output of user agent information
 *     content:
 *       application/json:
 *         schema:
 *         type: object
 *         example: 
 *          useragent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36
 * 
 *       
 * 
*/
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

/**
 * @swagger
 * /domain/{domain}:
 *  get:
 *   summary: Get domain information
 *   description: Get domain information in JSON format
 *   parameters:
 *     - in: path
 *       name: domain 
 *       schema:
 *         type: string
 *       required: true
 *       description: The domain name to look up
 *       responses:
 *         200:
 *         description: Successful response with JSON output of domain information
 *         content:
 *          text/plain:
 *         schema:
 *           type: string
 *           example: 
 *            ip: 8.8.8.8
 *            asn_no: 15169
 *            asn_org: Google LLC
 *            country: US
 *            city: Mountain View
 *            hostname: dns.google
 *            browser: Chrome
 * 
 */
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
/**
 * @swagger
 * /{ip}:
 *  get:
 *   summary: Get IP address information in JSON format
 *   description: Get IP address information in JSON format
 *   parameters:
 *     - in: path
 *       name: ip
 *       schema:
 *         type: string
 *       required: true
 *       description: The IP address to look up
 *       responses:
 *         200:
 *         description: Successful response with JSON output of IP address information
 *         content:
 *          text/plain:
 *         schema:
 *           type: string
 *           example: 
 *            ip: 8.8.8.8
 *            asn_no: 15169
 *            asn_org: Google LLC
 *            country: US
 *            city: Mountain View
 *            hostname: dns.google
 *            browser: Chrome
 * 
 */

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
