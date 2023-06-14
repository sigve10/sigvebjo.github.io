var http = require('http');
var url = require('url')

var server = http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'})
    response.write("Hello World")
    return response.end()
})