var express = require('express');
var sqlite3 = require('sqlite3').verbose();

var app = express();

var port = process.env.PORT || 8080;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/messages', function(req, res) {
    var db = new sqlite3.Database('messages.db');

    var message = {
        'number': req.body.number,
        'message': req.body.message,
        'lat': req.body.lat,
        'lng': req.body.lng
    };

    db.run("CREATE TABLE if not exists messages (number TEXT, message TEXT, lat REAL, lng REAL)");

    db.serialize(function() {
        var stmt = db.prepare("INSERT INTO messages (number, message, lat, lng) VALUES(?, ?, ?, ?)");
        stmt.run(message['number'], message['message'], message['lat'], message['lng']);
        stmt.finalize();
    });
    db.close();

    console.log(message);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(message));
});

app.listen(port, function() {
    console.log("Running on port " + port);
});
