//подключение модулей
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//массив пользователей
var users = [];
 
 //определение обработчика для пути, запуск файла индекс
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
//создается прослушка на событие коннекшн с аргументом сокет
io.on('connection', function(socket){
  console.log('a user connected');
  var ID = (socket.id).toString().substr(1, 4);
	var time = (new Date).toLocaleTimeString();
    io.sockets.emit('con', {'name': ID, 'time': time});
    users.push(ID);
    socket.emit('con1', {'name': ID, 'time': time});
    io.sockets.emit('updateOnline', users)
   socket.on('chat message', function(msg){
    socket.broadcast.emit('chat message', {'name': ID, 'time': time, 'text': msg } );
})
    socket.on('disconnect', function(){
    	console.log('user disconnected');
    	var ID = (socket.id).toString().substr(1, 4);
		var time = (new Date).toLocaleTimeString();
    	io.sockets.emit('dis', {'name': ID, 'time': time});
    	users.pop(ID);
    	io.sockets.emit('updateOnline', users)

	});
});
 
//прослушка сервера на порт 3000
http.listen(3000, function(){
  console.log('listening on *:3000');
});
