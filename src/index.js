var http = require('http');
var url = require('url');
var fs = require("fs");

const PUBLIC_DIR = __dirname + "/public"

const REDIRECT_HEADER = {"Location" : PUBLIC_DIR + "/index"}
const DEFAULT_HEADER = {"Content-Type" : "text/html"}

const PAGE_NOT_FOUND_FILE = PUBLIC_DIR + "/pageNotFound.html"

/**
 * Redirects the user to the 404 page.
 * 
 * @param {http.IncomingMessage} response response from the http protocol
 */
function onIllegalRequest(response) {
    const CRITICAL_NOT_FOUND = 
        "<h1>404: Page not found</h1><h2>No 404 redirect found, contact admin</h2>"


    if (!response) return;

    // Attempts to find the 404 file for redirects
    fs.readFile(PAGE_NOT_FOUND_FILE, function(err, data) {
        response.writeHead(404, DEFAULT_HEADER)
        if (err) {
            // Provide a critical error if the 404 file was not readable
            response.write(CRITICAL_NOT_FOUND)
        } else {
            // Otherwise provide the default 404 page
            response.write(data)
        }
        return response.end()
    })

    
}

function loadCss(request, response) {
    // Guard for request and response
    if (!request || !response) return;

    var parsedUrl = url.parse(request.url, true)
    var urlPath = parsedUrl.pathname

    var filePath = __dirname + urlPath

    fs.write()
}

/**
 * Handles a connection request, and redirects the user appropriately.
 * 
 * @param {http.IncomingMessage} request request from the http protocol
 * @param {http.IncomingMessage} response response from the http protocol
 */
function onRequest(request, response) {
    // Guard for request and response
    if (!request || !response) return;

    // Parse url and separate components
    var parsedUrl = url.parse(request.url, true)
    var urlPath = parsedUrl.pathname
    var args = parsedUrl.query

    // Assembles a file path internally
    var filePath = PUBLIC_DIR + urlPath
    
    // If the request contains a file ending, permit access
    // Does not permit access to .js files
    if (!request.url.match(".+\\..{2,4}")) {
        filePath += ".html"
    }

    console.debug(filePath) // Debug line, TODO: Remove
    console.debug(request.url.search("\\..{3,4}"))

    fs.readFile(filePath, function(err, data) {
        // Checks if the path is empty, and if so, redirect to homepage
        if (!urlPath || urlPath == "/") {
            response.writeHead(301, REDIRECT_HEADER)
            return response.end()
        }
        // Handle illegal requests
        if (err) return onIllegalRequest(response);

        // Create website response in the case of a legal link
        response.writeHead(200, DEFAULT_HEADER)
        response.write(data)
        return response.end()
    })
}

http.createServer(onRequest).listen(8080)