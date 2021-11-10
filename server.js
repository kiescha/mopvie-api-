const http = require('http');

http.createServer((request, response) => {
    response.writeHead(200, {'content-type': 'text/plain'});
    response.end('Welcome!');
}).listen(8080);

Console.log('Up and running');