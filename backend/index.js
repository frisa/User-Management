var http = require("http")
var applicationName = "HTTP Server"

http.createServer(function(request, response){
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('HTTP Server is running\n');
}).listen(8081);

console.log('Server running at http://127.0.0.1:8081/');

