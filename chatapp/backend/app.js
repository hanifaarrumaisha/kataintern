var express = require('express');
var socket = require('socket.io');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

rl.prompt();

var message;

var app = express();
var path = require('path');

server = app.listen(8080, function(){
    console.log('server is running on port 8080')
});

app.get('/', function(req, res){
    res.sendFile(path.resolve(__dirname + '/../public/index.html'));
});

io = socket(server);

var id = [];

io.on('connection', (socket) => {
    console.log(socket.id + ': is connected');
    id=id.concat(socket.id);
    console.log(id);

    rl.on('line', (line) => {
        if (line.substr(0, 4)=='text') {
            message={
                'type':'Text',
                'context':line.substr(5, line.length-5)
            };
            console.log(message)
            socket.broadcast.emit('SEND_BROADCAST', message);
        } else if (line.substr(0,7)=='buttons'){
            console.log(line.substr(0,7));
            message = {
                'type':'Template',
                'items':[
                    {
                        "item": "button",
                        "text": "yes"
                    },
                    {
                        "item": "button",
                        "text": "no"
                    }    
                ]
            }
        }
        rl.prompt();
    }).on('close', () => {
        console.log('Have a great day!');
        process.exit(0);
    });

    socket.on('disconnect', function(){
        console.log(socket.id + ': is disconnected');
    });

    socket.on('SEND_MESSAGE', function(data){
        io.emit('RECEIVE_MESSAGE', data);
        console.log(socket.id + " is writing '" + data.context+"'")
    });
    
});