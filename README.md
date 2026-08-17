<<<<<<< HEAD
# 🌐 IPA.wtf - What's Your IP?
=======
## Website
https://www.ipa.wtf
>>>>>>> 6ba07ac2811fffc29a104903d1525c2409eeb52b

> A fast, feature-rich IP information service with geolocation, browser detection, and WHOIS lookups built with Node.js and Express.

[![GitHub Stars](https://img.shields.io/github/stars/Newtbot/IPa?style=flat-square)](https://github.com/Newtbot/IPa)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green?style=flat-square)](https://nodejs.org/)

**Live:** [whatismyip.ipa.wtf](https://whatismyip.ipa.wtf/)

---

## ✨ Features

- 🎯 **Instant IP Detection** - Automatically detects your public IP address
- 🌍 **Geolocation Data** - City, country, and ASN information using MaxMind GeoLite2
- 🌐 **IPv4 & IPv6 Support** - Works with both address formats
- 🔍 **Browser Detection** - Identifies your browser and device information
- 📡 **Reverse DNS Lookup** - Retrieves hostname from IP address
- 📋 **WHOIS Lookups** - Query domain and network information
- 📊 **Multiple Export Formats** - JSON, YAML, and plain text output
- ⚡ **Rate Limiting** - Protects API from abuse (100 requests/15 min)
- 🎨 **Modern UI** - Beautiful responsive frontend with copy-to-clipboard features
- 🔒 **Proxy-Aware** - Correctly detects IPs behind reverse proxies
- 📱 **Mobile Friendly** - Fully responsive design for all devices

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Newtbot/IPa.git
cd IPa

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the project root:

```env
port=80
```

### Running the Server

```bash
# Production
npm start

# Development (with auto-reload)
npx nodemon bin/www
```

The server will start on port 80 (configurable) and automatically download GeoLite2 databases on startup. It will refresh these databases every 12 hours.

Access the web interface at: `http://localhost`

---

## 📡 API Endpoints

All endpoints are prefixed with `/api/v0/service/`

### Client IP Information

Get information about the requesting client's IP:

```bash
# Basic JSON format
curl http://localhost/api/v0/service/json
# Response: { ip, asn_no, asn_org, country, city, hostname, browser }

# Full JSON with all geolocation details
curl http://localhost/api/v0/service/fulljson

# YAML format
curl http://localhost/api/v0/service/yaml

# Plain text
curl http://localhost/api/v0/service/text
```

### Lookup Specific IP

```bash
# Get information about a specific IP
curl http://localhost/api/v0/service/8.8.8.8
```

### Browser/User Agent

```bash
# Get browser and device information
curl http://localhost/api/v0/service/useragent
```

### WHOIS Lookup

```bash
# Query WHOIS data for a domain
curl http://localhost/api/v0/service/domain/example.com
```

### Example Response (JSON)

```json
{
  "ip": "203.0.113.45",
  "asn_no": 12345,
  "asn_org": "Example ISP Inc.",
  "country": "United States",
  "city": "San Francisco",
  "hostname": "example.com",
  "browser": "Chrome"
}
```

---

## 🏗️ Project Structure

```
IPa/
├── bin/
│   └── www                 # HTTP server entry point
├── database/
│   └── model/             # Sequelize ORM models (reserved)
├── functions/
│   └── api.js            # Core parsing functions (IP, UA, domain, YAML)
├── middleware/
│   └── (reserved)        # Future middleware components
├── modules/
│   └── rateLimiter.js    # Express rate limiting configuration
├── public/
│   ├── css/
│   │   └── style.css     # Modern responsive styling
│   └── js/
│       ├── app.js        # Frontend API client
│       └── jq-repeat.js  # Template rendering utility
├── routes/
│   ├── api.js            # API endpoint handlers
│   ├── api_routes/       # API route mounting
│   └── render.js         # Page rendering routes
├── views/
│   ├── top.ejs           # HTML head, navbar
│   ├── index.ejs         # Main page template
│   ├── bot.ejs           # Footer
│   └── tos.ejs           # Terms of service
├── app.js                # Express app configuration
├── package.json          # Dependencies and scripts
└── .env                  # Environment variables
```

---

## 🛠️ Technology Stack

**Backend**
- **Express.js** - Web framework
- **MaxMind GeoLite2** - IP geolocation databases
- **Maxmind** - MMDB file parser
- **whois-node-json** - WHOIS lookups
- **detect-browser** - User agent parsing
- **express-rate-limit** - Request throttling

**Frontend**
- **EJS** - Template engine
- **Bootstrap 5** - Responsive framework
- **Font Awesome 6** - Icon library
- **jQuery** - DOM manipulation
- **Mustache.js** - Template rendering

**Development**
- **Nodemon** - Auto-restart on changes
- **dotenv** - Environment configuration

---

## 🔧 Configuration

### Rate Limiting

Edit `modules/rateLimiter.js` to customize:

```javascript
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // Time window (15 minutes)
    limit: 100,                 // Max requests per window
});
```

### Reverse Proxy

If behind a reverse proxy (nginx, Cloudflare, etc.), the app automatically trusts `X-Forwarded-For` headers:

```javascript
app.set('trust proxy', 1)  // In app.js
```

### GeoLite2 Database

Databases are downloaded automatically:
- **On startup** - Initial download
- **Every 12 hours** - Refresh cycle
- **Location** - System temp directory (managed by `geolite2-redist`)

---

## 📝 API Usage Examples

### JavaScript/Fetch

```javascript
// Get your IP info
const response = await fetch('/api/v0/service/json');
const data = await response.json();
console.log(`Your IP: ${data.ip}`);
console.log(`Location: ${data.city}, ${data.country}`);
```

### cURL

```bash
# Get JSON response
curl -s http://localhost/api/v0/service/json | jq

# Lookup specific IP with YAML output
curl http://localhost/api/v0/service/yaml > output.yaml

# Get WHOIS data for a domain
curl http://localhost/api/v0/service/domain/github.com
```

### Python

```python
import requests

response = requests.get('http://localhost/api/v0/service/json')
ip_info = response.json()
print(f"IP: {ip_info['ip']}")
print(f"ISP: {ip_info['asn_org']}")
```

---

## 🎨 Frontend Features

The modern web interface includes:

- ✅ **Real-time IP Detection** - Automatically loads on page visit
- ✅ **Copy-to-Clipboard** - Quick copy of IP, hostname, ASN, and location
- ✅ **Visual Feedback** - "Copied!" confirmation message
- ✅ **Responsive Cards** - Beautiful grid layout for all data
- ✅ **Export Options** - Download data as JSON, YAML, or text
- ✅ **Dark Theme** - Easy on the eyes with purple/pink gradients
- ✅ **Mobile Optimized** - Perfect experience on all devices

---

## 🐛 Troubleshooting

### GeoLite2 Database Download Fails

```
Error downloading MMDB files: EACCES
```

**Solution:** Ensure the process has write permissions to the system temp directory.

### Client IP Always Shows 127.0.0.1

**Cause:** App is behind a reverse proxy but `trust proxy` not configured.

**Solution:** Verify `app.set('trust proxy', 1)` in `app.js` and that your proxy sends `X-Forwarded-For` headers.

### Rate Limiting is Too Strict/Lenient

**Solution:** Adjust `windowMs` and `limit` in `modules/rateLimiter.js` and restart the server.

### Port Already in Use

```bash
# Change port in .env
port=3000

# Or kill existing process on port 80
sudo lsof -ti:80 | xargs kill -9
```

---

## 🚧 Roadmap

Future enhancements planned:

- [ ] **Request Caching** - In-memory or Redis caching for frequently queried IPs
- [ ] **Statistics Middleware** - Track request patterns and usage analytics
- [ ] **Batch IP Lookup** - Upload CSV/Excel files to lookup multiple IPs
- [ ] **SQLite Support** - Local database for caching and persistence
- [ ] **Dashboard** - Admin panel for statistics and monitoring
- [ ] **API Key System** - Rate limit per API key instead of IP
- [ ] **Dark/Light Mode Toggle** - User preference in UI

---

## 📄 Terms of Service

See [/tos](/tos) route or `views/tos.ejs` for service terms.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📚 Documentation

- **Copilot Instructions:** See `.github/copilot-instructions.md` for development guidelines
- **API Docs:** Swagger documentation is configured (see `app.js`)
- **Architecture:** Read `.github/copilot-instructions.md` for detailed project architecture

---

## 📊 Performance

- **Response Time:** ~50-100ms average
- **Rate Limit:** 100 requests per 15-minute window per IP
- **Database Size:** ~40MB (GeoLite2 databases)
- **Memory Usage:** ~150MB typical

---

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Newtbot** - [GitHub Profile](https://github.com/Newtbot)

---

## 🙏 Acknowledgments

- **MaxMind** - GeoLite2 geolocation database
- **Express.js** - Web framework
- **Bootstrap** - CSS framework
- **Font Awesome** - Icon library

---

## 💡 Questions or Issues?

- 📌 [Open an Issue](https://github.com/Newtbot/IPa/issues)
- 🔗 [View on GitHub](https://github.com/Newtbot/IPa)
- 🌐 [Visit Website](https://whatismyip.ipa.wtf/)



