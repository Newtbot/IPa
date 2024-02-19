const maxmind = require('maxmind');
const geolite2 = require('geolite2-redist');
const path = require('path');
const ipInfo = require("ipinfo")


async function parseIP(ip){
    //download db on run
    // await geolite2.downloadDbs("../database/model/");

    let asnLookup = await geolite2.open('GeoLite2-ASN', path => {
      return maxmind.open(path);
    });

    let ASN = asnLookup.get("49.245.69.217");

    // Call this when done to empty node's event loop
    lookup.close();


    return { ASN  }
  }    



/*
(async () => {
  await geolite2.downloadDbs()
  let lookup = await geolite2.open('GeoLite2-City', path => {
    return maxmind.open(path);
  });

  let city = lookup.get('66.6.44.4');

  // Call this when done to empty node's event loop
  lookup.close();
})();


*/

module.exports = { parseIP , ipInfo };
