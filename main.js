var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: 'false'});
var test_api = require('./test_api/test.js');

//set port
app.set('port', (process.env.PORT || 3000));

//serve static assets normally
app.use('/', express.static(path.join(__dirname, 'public')));

//for every other route, serve up index.html
app.get('*', function(request, response){
  response.redirect(301, path.resolve(__dirname, 'public', 'index.html'));
});

//receiving user's javascript input
app.post('/', parseUrlencoded, function(request, response){
    var jsData = request.body.code_input;
    var messages = test_api(jsData);
    response.status(200).json(messages);
});

//listen for requests on port and log process
app.listen(app.get('port'), function() {
   console.log('Server started: http://localhost:' + app.get('port') + '/');
 });