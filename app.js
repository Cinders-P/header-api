var express = require('express');
var stylus = require('stylus');
var path = require('path');
var app = express();

app.enable('trust proxy');

app.use(stylus.middleware({
	src: __dirname + '/public',
	dest: __dirname + '/public'
}));

app.set('views', __dirname + '/public');
app.set('view engine', 'pug');

app.get("/whoami", function(req, res) {
    res.send(JSON.stringify({
        "ipaddress": req.ip,
        "language": req.headers['accept-language'].substring(0, req.headers['accept-language'].search(/[^a-z\-]/i)),
        "software": req.headers['user-agent'].substring(req.headers['user-agent'].search(/\(/) + 1, req.headers['user-agent'].search(/\)/))
    }));
    res.end();
});

app.use(express.static(__dirname + '/public'));

app.use("/", function(req, res) {
	res.render(path.join(__dirname + "/public/index.pug"), {
		who: req.protocol + '://' + req.get('host') + '/whoami'
	});
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Header parser listening on port 3000.");
});
