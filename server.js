var express = require('express');
var app = express();

var server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs'),
    hue = require('hue-module'),
    hueMod = require('./hue'),
    gameMod = require('./game')


hue.load("192.168.2.166", "bazathackedio");


//init modules
hueMod.init(hue);
gameMod.init();

var gameStarted = false;

var startGame = function() {
		gameStarted = true;
		setInterval(function() {
						var r_colour = hueMod.colourRandomizer();
						var g_colour = hueMod.colourRandomizer();
						var b_colour = hueMod.colourRandomizer();
			hueMod.changeColours(r_colour, g_colour, b_colour);
		}, 1000);
}

// The number of milliseconds in one day
var oneDay = 86400000;

app.set("port", 8000);
// Use compress middleware to gzip content
app.use(express.compress());

// Serve up content from public directory
app.use(express.static(__dirname + '/public', { maxAge: oneDay }));



server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});




/**
 *
 *
 * SOCKET related code
 *
 *
 *
 */
var connections;

io.sockets.on('connection', function (socket) {

    socket.on('connect', function(data) {
        hueMod.blink();
        if (!gameStarted) {
            socket.emit('connected', "ready");
        }
    });

    socket.on('join', function(data) {

         socket.emit('connected', "ready");
    });

});


