const maxmind = require("maxmind");
const geolite2 = require("geolite2-redist");
const path = require("path");
const dns = require("dns");
const { detect } = require("detect-browser");
const YAML = require("yaml");
const whois = require('whois-node-json')
dnsPromise = dns.promises;

/*
Note: supports both ipv4 and ipv6
*/
async function parseIP(ip) {
	//download db on run
	// await geolite2.downloadDbs("../database/model/");

	let asnLookup = await geolite2.open("GeoLite2-ASN", (path) => {
		return maxmind.open(path);
	});

	let cityLookup = await geolite2.open("GeoLite2-City", (path) => {
		return maxmind.open(path);
	});

	let ASN = asnLookup.get(ip);
	let city = cityLookup.get(ip);

	//https://stackoverflow.com/questions/54887025/get-ip-address-by-domain-with-dns-lookup-node-js#:~:text=const%20dns%20%3D%20require(%27dns%27)%3B%0AdnsPromises%20%3D%20dns.promises%3B%0A%0Aasync%20function%20test()%20%7B%0A%20%20let%20data%20%3D%20await%20dnsPromises.lookup((%22www.aWebSiteName.am%22)%3B%0A%7D
	async function reverseHostname() {
		const data = await dnsPromise.reverse(ip) 
		return data;
	}

	//WORKS but returns an array
	let hostname = await reverseHostname();

	// Call this when done to empty node's event loop
	asnLookup.close();
	cityLookup.close();

	return { ASN, city, hostname , ip };
}

async function parseUserAgent(userAgent) {
	const browserInfo = detect(userAgent);
	return browserInfo;
}

async function parseDomain(domain) {
	/*
	whois('google.com').then(result => console.log('domain whois:', result))
	whois('AS3333').then(result => console.log('asn whois:', result))
	whois('193.0.0.0/21').then(result => console.log('network whois:', result))
	whois('2001:67c:2e8:22::c100:68b').then(result => console.log('network ipv6:', result))
	*/

	let res = await whois(domain)
	return res;
}

async function parseYAML(result) {
	//YAML.stringify({ hello: 'world' })
	// => 'hello: world\n'
	//https://eemeli.org/yaml/#yaml-parse
	return YAML.stringify(result);
}

module.exports = { parseIP, parseUserAgent, parseDomain, parseYAML };
