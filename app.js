const express = require("express");
const path = require("path");
const { limiter } = require("./modules/rateLimiter");
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

//route logic
app.use("/api/v0", require("./routes/api_routes"));

//render logic
app.use("/", require("./routes/render"));

// Hold list of functions to run when the server is ready
app.onListen = [
	function () {
		console.log("Express is ready");
	},
];


/*
potential features
1) accept text / excel file and look up ip addresses 
2) accept text / excel file and look up domain names
3) cache
4) db support for optimization
*/

/*
Note to self regarding API services in used.
1) maxmind geo ip locater 
2) Whatismybrowser
3) domain lookup  
*/

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

//setinterval to load mmdb files from redist
setInterval(() => {
	import('geolite2-redist')
		.then(geolite => geolite.downloadDbs())
		.catch(error => {
			console.error('Error downloading MMDB files:', error.message);
			console.error(error.stack);
		});
}, 43200000);

//listen to port
// app.listen(process.env.port, () => {
// 	console.log("Server is running on port 80");
// });

module.exports = app;
