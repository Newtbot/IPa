"use strict";
const { 
    parseIP, 
    parseUserAgent, 
    parseDomain,
    parseYAML,
} = require("../functions/api");
const CacheManager = require("../modules/cacheManager");
const express = require("express");
const router = express.Router();

// Layer 2 Caching: In-memory cache with 1 hour TTL
const ipCache = new CacheManager(3600); // 1 hour for IP lookups
const domainCache = new CacheManager(86400); // 24 hours for WHOIS lookups

/*
Note:
? is a null check operator
?? is a null check operator that returns the right hand side if the left hand side is null
*/


router.use("/json", async (req, res, next) => {
	try {
		var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
		var userAgent = req.get("User-Agent");

		// Check cache first
		let cachedResult = ipCache.get(`ip:${ip}`);
		if (cachedResult) {
			console.log(`✅ Cache hit for ${ip}`);
			return res.json(cachedResult);
		}

		// Cache miss - do lookups
		console.log(`📍 Cache miss for ${ip} - fetching from databases`);
        let Res = await parseIP(ip);
        let browserRes = await parseUserAgent(userAgent);
        
        if (!browserRes) return false;
		if (!Res) return false;
		
		const result = {
            ip: ip,
			asn_no: Res.ASN?.autonomous_system_number,
			asn_org: Res.ASN?.autonomous_system_organization,
			country: Res.city?.country?.names?.en ?? Res.city?.country?.iso_code ?? "N/A",
			city: Res.city?.city?.names?.en ?? "N/A",
			hostname: Res.hostname ? Res.hostname[0] : "N/A",
            browser: browserRes.name ?? "Unknown Browser", 
		};
		
		// Cache the result
		ipCache.set(`ip:${ip}`, result);
		
		res.json(result);
	} catch (error) {
		console.error(error);
		next(error);
	}
});
 
//full json with language
router.use("/fulljson", async (req, res, next) => {
	try {
		var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
		var userAgent = req.get("User-Agent");

		// Check cache first
		let cachedResult = ipCache.get(`fulljson:${ip}`);
		if (cachedResult) {
			console.log(`✅ Cache hit for fulljson:${ip}`);
			return res.send(cachedResult);
		}

		console.log(`📍 Cache miss for fulljson:${ip}`);
        let Res = await parseIP(ip);
        let browserRes = await parseUserAgent(userAgent);
        
        if (!browserRes) return false;
		if (!Res) return false;
		
		const result = { Res, browserRes };
		ipCache.set(`fulljson:${ip}`, result);
		
		res.send(result);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//yaml
router.use("/yaml", async (req, res, next) => {
	try {
		var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
		var userAgent = req.get("User-Agent");

		// Check cache first
		let cachedResult = ipCache.get(`yaml:${ip}`);
		if (cachedResult) {
			console.log(`✅ Cache hit for yaml:${ip}`);
			res.set('Content-Type', 'text/yaml');
			return res.send(cachedResult);
		}

		console.log(`📍 Cache miss for yaml:${ip}`);
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
        
        ipCache.set(`yaml:${ip}`, yamlRes);
        res.set('Content-Type', 'text/yaml');
        res.send(yamlRes);
	} catch (error) {
		console.error(error);
		next(error);
	}
});


//text
router.use("/text", async (req, res, next) => {
	try {
		var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
		var userAgent = req.get("User-Agent");

		// Check cache first
		let cachedResult = ipCache.get(`text:${ip}`);
		if (cachedResult) {
			console.log(`✅ Cache hit for text:${ip}`);
			res.set('Content-Type', 'text/plain');
			return res.send(cachedResult);
		}

		console.log(`📍 Cache miss for text:${ip}`);
        let Res = await parseIP(ip);
        let browserRes = await parseUserAgent(userAgent);
        
        if (!browserRes) return false;
		if (!Res) return false;
		
        const result = { 
            ip: ip,
            asn_no: Res.ASN?.autonomous_system_number,
			asn_org: Res.ASN?.autonomous_system_organization,
			country: Res.city?.country?.names?.en ?? Res.city?.country?.iso_code ?? "N/A",
			city: Res.city?.city?.names?.en ?? "N/A",
			hostname: Res.hostname ? Res.hostname[0] : "N/A",
            browser: browserRes.name ?? "Unknown Browser",
        };
        
        ipCache.set(`text:${ip}`, result);
        res.set('Content-Type', 'text/plain');
        res.send(result);
	} catch (error) {
		console.error(error);
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
        console.error(error);
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
        // Check cache first
        let cachedResult = domainCache.get(`domain:${domain}`);
        if (cachedResult) {
			console.log(`✅ Cache hit for domain:${domain}`);
            res.set('Content-Type', 'application/json');
            return res.send(JSON.stringify(cachedResult, null, 4));
        }

		console.log(`📍 Cache miss for domain:${domain}`);
        let Res = await parseDomain(domain);
        if (!Res) return false;
        
        domainCache.set(`domain:${domain}`, Res);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(Res, null, 4));

    } catch (error) {
        console.error(error);
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
        // Check cache first
        let cachedResult = ipCache.get(`lookup:${ip}`);
        if (cachedResult) {
			console.log(`✅ Cache hit for lookup:${ip}`);
            return res.json(cachedResult);
        }

		console.log(`📍 Cache miss for lookup:${ip}`);
        let Res = await parseIP(ip);
        if (!Res) return false;
        
        const result = {
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
        };
        
        ipCache.set(`lookup:${ip}`, result);
        res.json(result);
    } catch (error) {
        console.error(error);
        next(error);
    }

});

module.exports = router;
