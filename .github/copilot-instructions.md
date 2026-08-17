# Copilot Instructions for IPa

## Project Overview
IPA is a "What Is My IP" service built with Express.js that provides IP geolocation data, domain lookups, and browser detection. The application uses MaxMind's GeoLite2 databases for IP geolocation and includes rate limiting to prevent abuse.

## Getting Started

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env` file in the project root with the required variables:
```env
port=80
```

### Starting the Server
```bash
npm start
# or with nodemon for development:
npx nodemon bin/www
```

The server will download GeoLite2 MMDB files automatically on startup via the `geolite2-redist` package and every 12 hours thereafter.

### Running Tests
```bash
npm test
```
Note: Currently no tests are configured. Test suite should be added as development progresses.

## Architecture Overview

### Request Flow
1. **Entry Point**: `bin/www` - HTTP server initialization (loads `.env`, creates Express server)
2. **Main App**: `app.js` - Express application configuration (middleware setup, route mounting)
3. **Routes**:
   - `/api/v0/service/*` → `routes/api_routes/` → `routes/api.js`
   - `/` → `routes/render` (frontend views)

### Core Components

**Rate Limiting** (`modules/rateLimiter.js`)
- Applied globally in `app.js` with `limiter` middleware
- 100 requests per 15-minute window per IP
- Enforces API rate limits to prevent abuse

**IP/Domain Parsing** (`functions/api.js`)
- `parseIP()` - GeoLite2-based geolocation (ASN, City, hostname reverse DNS)
- `parseUserAgent()` - Browser detection using `detect-browser`
- `parseDomain()` - WHOIS lookups via `whois-node-json`
- `parseYAML()` - Output formatting

**API Endpoints** (`routes/api.js`)
- `/api/v0/service/json` - Basic IP data (IP, ASN, country, city, hostname, browser)
- `/api/v0/service/fulljson` - Full geolocation data with language variants
- `/api/v0/service/yaml` - YAML-formatted IP data
- `/api/v0/service/text` - Plain text IP output
- `/api/v0/service/useragent` - Browser/user agent detection
- `/api/v0/service/domain/:domain` - WHOIS domain lookup
- `/api/v0/service/:ip` - IP lookup (custom input, not just client IP)

Client IP detection uses `req.headers["x-forwarded-for"] || req.socket.remoteAddress` to handle reverse proxies.

### Frontend
- **Template Engine**: EJS (`views/` directory)
- **Static Assets**: CSS, JavaScript, images in `public/`
- **Routes**: Mounted at `/` via `routes/render.js`

### Database
Structured for Sequelize ORM but currently unused (`database/model/`). Future optimization may leverage SQLite or database caching.

## Key Conventions

### IP Address Handling
- Supports both IPv4 and IPv6
- Client IP extraction: `req.headers["x-forwarded-for"] || req.socket.remoteAddress`
- Always enable `app.set('trust proxy', 1)` for accurate IP detection behind reverse proxies

### Error Handling
- Try-catch blocks in async route handlers with `next(error)` for middleware error handling
- Check responses with null-coalescing (`??`) and optional chaining (`?.`) before use
- Log errors to console; ensure error status codes are set (404, 401, 422 suppressed from logging)

### Async/Await Patterns
- Database lookups (ASN, City) open and must be closed after use:
  ```javascript
  let asnLookup = await geolite2.open(...);
  // use lookup
  asnLookup.close();
  ```
- All parsing functions are async; always `await` them and handle errors appropriately

### Code Style
- Use `"use strict";` at the top of modules
- Destructure imports: `const { parseIP } = require("../functions/api")`
- Default to ECMA CommonJS (`require`/`module.exports`) except where dynamic imports are needed (e.g., geolite2 usage)

### Response Format
- Default JSON responses with `app.set("json spaces", 2)` for readability
- Use consistent field naming (e.g., `asn_no`, `asn_org`, `country`, `city`, `hostname`, `browser`)
- Return 404 as JSON: `{ error: "Page not found" }`

## Dependencies

**Core Framework**
- `express` - Web framework
- `ejs` - Template engine

**Geolocation & Network**
- `geolite2-redist` - GeoLite2 MMDB database distribution (auto-downloads on startup)
- `maxmind` - MMDB file parsing
- `whois-node-json` - WHOIS lookups

**Utilities**
- `detect-browser` - User agent parsing
- `express-rate-limit` - Request rate limiting
- `dotenv` - Environment variable management
- `yaml` - YAML serialization
- `swagger-jsdoc` & `swagger-ui-express` - API documentation (configured but not heavily used)

**Development**
- `nodemon` - Auto-restart on file changes

## Future Enhancements (From TODO List)
- Implement request caching (likely in-memory or Redis)
- Add middleware for request/response statistics capture
- Build CSV/Excel batch IP/domain lookup UI
- Add SQLite support for local data storage
- Consider bulk file upload features for IP/domain lookups

## Troubleshooting

**GeoLite2 Database Download Issues**
- Verify `geolite2-redist` can write to temp directory
- Check console output for MMDB file paths
- Database downloads occur every 12 hours and on startup

**Client IP Detection Issues**
- Ensure `trust proxy` is set if behind a reverse proxy (nginx, load balancer)
- Verify `X-Forwarded-For` header is properly passed from proxy

**Rate Limiting**
- Bypass in tests by removing `limiter` middleware or using `skip` option
- Adjust `windowMs` and `limit` in `modules/rateLimiter.js` as needed
