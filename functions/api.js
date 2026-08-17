
const maxmind = require("maxmind");
const geolite2 = require("geolite2-redist");
const path = require("path");
const dns = require("dns");
const { detect } = require("detect-browser");
const YAML = require("yaml");
const whois = require('whois-node-json')
dnsPromise = dns.promises;

// Global database connections (initialized once, reused forever)
let asnLookup = null;
let cityLookup = null;

/**
 * Initialize MaxMind database connections (call once on startup)
 * Layer 1 Caching: Keep databases open in memory instead of reopening them
 */
async function initializeDatabases() {
	try {
		asnLookup = await geolite2.open("GeoLite2-ASN", (dbPath) => {
			console.log("📍 Loading ASN database from:", dbPath);
			return maxmind.open(dbPath);
		});

		cityLookup = await geolite2.open("GeoLite2-City", (dbPath) => {
			console.log("📍 Loading City database from:", dbPath);
			return maxmind.open(dbPath);
		});

		console.log("✅ MaxMind databases initialized (persistent connections)");
	} catch (error) {
		console.error("❌ Failed to initialize databases:", error);
		throw error;
	}
}

/**
 * Close database connections (call on shutdown)
 */
function closeDatabases() {
	if (asnLookup) asnLookup.close();
	if (cityLookup) cityLookup.close();
	console.log("✅ Database connections closed");
}

/**
 * Parse IP address using persistent database connections
 * Supports both IPv4 and IPv6
 */
async function parseIP(ip) {
	if (!asnLookup || !cityLookup) {
		throw new Error("Databases not initialized. Call initializeDatabases() first.");
	}

	let ASN = asnLookup.get(ip);
	let city = cityLookup.get(ip);

	// Reverse DNS lookup for hostname
	async function reverseHostname() {
		try {
			const data = await dnsPromise.reverse(ip);
			return data;
		} catch (error) {
			// DNS reverse lookup can fail, return empty array
			return [];
		}
	}

	let hostname = await reverseHostname();

	return { ASN, city, hostname, ip };
}

async function parseUserAgent(userAgent) {
	const browserInfo = detect(userAgent);
	return browserInfo;
}

async function parseDomain(domain) {
	let res = await whois(domain)
	return res;
}

async function parseYAML(result) {
	return YAML.stringify(result);
}

module.exports = { 
	initializeDatabases,
	closeDatabases,
	parseIP, 
	parseUserAgent, 
	parseDomain, 
	parseYAML 
};
