var express = require('express');
var socket = require('socket.io');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var app = express();
var path = require('path');

server = app.listen(8080, function(){
    console.log('server is running on port 8080')
});

app.get('/', function(req, res){
    res.sendFile(path.resolve(__dirname + '/../public/index.html'));
});

io = socket(server);

io.on('connection', (socket) => {
    console.log(socket.id + ' is connected');
    socket.on('disconnect', function(){
        console.log(socket.id + ' is disconnected');
    });
    socket.on('SEND_MESSAGE', function(data){
        io.emit('RECEIVE_MESSAGE', data);
        console.log(socket.id + ' is writing ' + data)
    });
});

