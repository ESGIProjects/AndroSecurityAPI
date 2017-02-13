var express = require('express');
var sqlite3 = require('sqlite3').verbose();

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/users', function(req, res) {
    var db = new sqlite3.Database('messages.db');

    var number = req.body.number;
    var message = req.body.message;
    var lat = req.body.lat;
    var lng = req.body.lng;

    db.run("CREATE TABLE if not exists messages (number TEXT, message TEXT, lat REAL, lng REAL)");

    db.serialize(function() {
        var stmt = db.prepare("INSERT INTO messages (number, message, lat, lng) VALUES(?, ?, ?, ?)");
        stmt.run(number, message, lat, lng);
        stmt.finalize();
    });
    db.close();

    res.send(req.body);
});

app.listen(8080);
