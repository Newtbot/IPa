const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.set("json spaces", 2);

//route logic
app.use("/api", require("./routes/api_routes"));

/*
potential features
1) accept text / excel file and look up ip addresses 
2) accept text / excel file and look up domain names
*/

/*
Note to self regarding API services in used.
1) maxmind geo ip locater 
2) Whatismybrowser
3) domain lookup  
*/
app.use("/", (req, res) => {
	//https://stackoverflow.com/questions/10849687/express-js-how-to-get-remote-client-address
	//var ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
	var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
	// console.log(ip);
	req.headers["user-agent"];

	//res html
	res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>IPA.wtf</title>
        <style>
            body {
                background-color: black;
                color: white; /* Set text color to white for better visibility */
            }
        </style>
    </head>
    <body>
        <center><h1>Your IP:</h1></center>
        <center><h2>${ip}</h2></center>

        <center><h1>Your User Agent:</h1></center>

        <center><h1>Your hostname:</h1></center>

        <center><h1>Your ISP:</h1></center>

        <center><h1>Your Location:</h1></center>

        <br>
        <br>
        <br>

        <center><h2>Our links and Services:</h2></center>
        <center><h2><a href="https://github.com/Newtbot/IPa">Our GitHub</a></h2></center>
        <center><h2><a href="#">JSON</a></h2></center>
        <center><h2><a href="#">YAML</a></h2></center>
        <center><h2><a href="#">TEXT</a></h2></center>

        <br>
        <br>
        <br>

        <center><h2> About us </h2></center>
        <center><h2>IPa.wtf is a simple service that provides information about 
        your IP address and User Agent. We also provide a few other services 
        such as IP and domain lookups. 
        </h2></center>

    </body>
    </html>`);
});

// Catch 404 and forward to error handler. If none of the above routes are
// used, this is what will be called.
app.use(function (req, res, next) {
	//application/json; charset=utf-8
	var err = new Error("Not Found");
	err.message = "Page not found";
	err.status = 404;
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

//listen to port
app.listen(process.env.port, () => {
	console.log("Server is running on port 80");
});

module.exports = app;
