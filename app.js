
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var tasks = require('./routes/tasks');
var http = require('http');
var path = require('path');

var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://@localhost:27017/test', {safe:true})

var bodyParser = require('body-parser');

var app = express();

app.use(function(req, res, next) {
  req.db = {};
  req.db.tasks = db.collection('tasks');
  next();
});

app.param('task_id', function(req, res, next, taskId) {
  req.db.tasks.findById(taskId, function(error, task){
    if (error) return next(error);
    if (!task) return next(new Error('Task is not found.'));
    req.task = task;
    return next();
  });
});

app.locals.moment = require('moment');

// all environments
app.set('port', process.env.PORT || 3008);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/tasks', tasks.add);
app.delete('/tasks/:task_id', tasks.del);
app.post('/tasks/:task_id', tasks.markCompleted);
app.get('/completed', tasks.completed);
//app.get('/users', user.list);

/*app.all('*', function(req, res){
  res.status(404).send();
})*/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
