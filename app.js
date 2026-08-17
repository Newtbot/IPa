const express = require("express");
const path = require("path");
const { limiter } = require("./modules/rateLimiter");
const { initializeDatabases, closeDatabases } = require("./functions/api");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(limiter);

app.set("json spaces", 2);
app.set('trust proxy', 1)

// Set up the templating engine to build HTML for the front end.
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

// Have express server static content( images, CSS, browser JS) from the public
app.use(express.static(path.join(__dirname, "./public")));

// Initialize MaxMind databases on startup (Layer 1 Caching: Persistent connections)
app.initialize = async function() {
	try {
		await initializeDatabases();
		console.log("🚀 MaxMind databases ready");
	} catch (error) {
		console.error("❌ Failed to initialize databases:", error);
		process.exit(1);
	}
};

// Cleanup on shutdown
process.on('SIGTERM', closeDatabases);
process.on('SIGINT', closeDatabases);

//route logic
app.use("/api/v0", require("./routes/api_routes"));

//render logic
app.use("/", require("./routes/render"));

// Hold list of functions to run when the server is ready
app.onListen = [
	function () {
		console.log("✅ Express is ready");
	},
];

// Catch 404 and forward to error handler. If none of the above routes are
// used, this is what will be called.
app.use(function (req, res, next) {
	var err = new Error("Not Found");
	err.message = "Page not found";
	err.status = 404;
	res.json({ error: err.message });
	next(err);
});
app.use(function (err, req, res, next) {
	if (![404, 401, 422].includes(err.status || res.status)) {
		console.error(err.message);
		console.error(err.stack);
		console.error("=========================================");
	}
	res.status(err.status || 500);
});

//setinterval to load mmdb files from redist (every 12 hours)
setInterval(() => {
	const geolite2 = require('geolite2-redist');
	geolite2.downloadDbs()
		.catch(error => {
			console.error('❌ Error downloading MMDB files:', error.message);
		});
}, 43200000);

module.exports = app;
