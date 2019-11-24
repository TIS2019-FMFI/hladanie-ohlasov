var http = require('http');
var url = require('url');
var fs = require('fs');
var io = require('socket.io')( { resource: '/citio/socket.io' });

io.on('connection'), socket => {
	socket.emit('connected', 'Hello World')
}

var server = http.createServer(function (req, res) {
  var path = url.parse(req.url).pathname;

  switch(path){
	case '/': 
  		res.writeHead(200, {'Content-Type': 'text/plain'});
  		res.write('Hello World\nI am node.js');
		res.end();
		break;
	case '/socket.html':
		fs.readFile(__dirname + path, function(error, data) {
			if (error)
			{
				res.writeHead(404);
				res.end('the file is missing - 404');
			}
			else
			{
				res.writeHead(200, {'Content-type': 'text-html'});
				res.write(data, 'utf8');
				res.end();
			}
		});
		break;
	default:
		res.writeHead(404);
		res.write('file not found - 404:');
		res.write(url.parse(req.url).href);
		res.end();
		break;
  }
});

server.listen(8058, '127.0.0.1');
var listener = io.listen(server);
listener.sockets.on('connection', function(socket) {
	socket.emit('message', { 'abc' : 1 });
	socket.on('message', function(data) {
		console.log(data.abc);
		setTimeout(function(x) { socket.emit('message', { 'abc' : x } ); }, 1000, (data.abc + 1));
        });
});

console.log('Server running at https://kempelen.dai.fmph.uniba.sk/citio/');
