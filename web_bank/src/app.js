var express = require("express");
var path = require("path");
var ejs = require("ejs");

var app = express();

app.get("/", function (req, res) {
    res.render('index');
});

app.set('views', path.resolve(__dirname, '../'));
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

console.log(path.join(__dirname, "../build"));

app.use('/build', express.static(path.join(__dirname, "../build")));

var nodeConf = require(path.join(__dirname, '../config/nodeconf.json'));
var server = app.listen(nodeCond["Bank"].Port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
});
