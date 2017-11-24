var express = require('express')
, http = require('http')
, path = require('path')
, morgan = require('morgan');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
app.use(morgan('dev'));
app.use('/n', express.static(path.join(__dirname, 'public')));

// router
app.get('/n', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('*', function(req, res, next) {
  res.redirect('/n');
});

http.createServer(app).listen(app.get('port'), function(){
console.log("Express server listening on port " + app.get('port'));
});