
var messages = [];

var requestHandler = function(request, response) {
  var data = {
    results: messages
  };

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var statusCode = 200;
  var headers = defaultCorsHeaders;

  if (request.method === 'GET' && request.url === '/classes/messages') {
    statusCode = 200;
  }

  if (request.method === 'POST' && request.url === '/classes/messages') {
    // set up body to be sent back to client
    var message = '';
    // set up listener for incoming data stream
    request.on('data', function(chunk) {
      message += chunk;
    });
    // setup listener for when data stream stops
    request.on('end', function() {
      // convert chunked message to a human readable message
      var parsedData = JSON.parse(message);
      // pushing message into our data.results array
      data.results.push(parsedData);
    });

    statusCode = 201;
  } 

  if (request.url !== '/classes/messages') { 
    statusCode = 404; 
  }

  response.writeHead(statusCode, headers);

  response.end(JSON.stringify(data));
};

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

module.exports.requestHandler = requestHandler;
