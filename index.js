var express = require('express');
var sqlite3 = require('sqlite3').verbose();

var app = express();

var db = new sqlite3.Database('messages.db');
var port = process.env.PORT || 8080;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    var messages = [];

	db.serialize(function() {
		db.each("SELECT messages.rowid AS id, messages.number, messages.message, messages.lat, messages.lng FROM messages ORDER BY id", function(err, row) {
			if (err) {
				console.error(err);
			}
			else {
				var message = {
					'id': row.id,
					'number': row.number,
					'message': row.description,
					'lat': row.lat,
					'lng': row.lng
				};
				messages.push(message);
			}
		}, function() {
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(messages));
		});
	});
	db.close();
});

app.post('/messages', function(req, res) {
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
