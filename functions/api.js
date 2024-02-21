const maxmind = require("maxmind");
const geolite2 = require("geolite2-redist");
const path = require("path");
const dns = require("dns");
const { detect } = require('detect-browser');
const whois = require('whois');
const browser = detect();
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
	let hostname= await reverseHostname();

	// Call this when done to empty node's event loop
	asnLookup.close();
	cityLookup.close();

	return { ASN, city, hostname };
}

async function parseUserAgent(userAgent) {
  const browserInfo = detect(userAgent);
  return browserInfo;
}


async function parseDomain(domain) {
  whois.lookup(domain, function(err, data) {
    console.log(data);
  });

}

module.exports = { parseIP , parseUserAgent  , parseDomain };
