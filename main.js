var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: 'false'});
var test_api = require('./test_api/test.js');

//set port
app.set('port', (process.env.PORT || 3000));

//set view engine
app.set('view engine', 'ejs');

//set where views are stored
app.set('views', path.join(__dirname, 'views'));

//serve up static files here
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(request, response){
    response.render('pages/index');    
});

app.get('/about', function(request, response){
   response.render('pages/about'); 
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