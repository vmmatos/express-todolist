
// add task
exports.add = function(req, res, next){

  // se o id tem data
  if (!req.body || !req.body.name) return next(new Error('campo vazio'));

  req.db.tasks.save({
    name: req.body.name,
    createTime: new Date(),
    completed: false
  }, 
  function(error, task){
    if (error) return next(error);
    if (!task) return next(new Error('Erro ao gravar'));

    console.info('Adicionou %s ++ id = %s', task.name, task._id);
    res.redirect('/');

  })
};

//del task
exports.del = function(req, res, next) {

  req.db.tasks.removeById(req.task._id, function(error, count) {

    if (error) return next(error);
    if (count !==1) return next(new Error('ERRO - del'));

    console.info('Apagou %s -- id=%s', req.task.name, req.task._id);
    res.status(204).send();

  });
};

//task completed
exports.markCompleted = function(req, res, next) {

  var completed = true;

  req.db.tasks.updateById(req.task._id, {$set: {completeTime: new Date(), completed: completed}}, function(error, count) {

    if (error) return next(error);

    console.info('tarefa %s ++ id=%s completa', req.task.name, req.task._id);
    res.redirect('/');

  })
};

//all task completed
exports.completed = function(req, res, next) {

  req.db.tasks.find({completed: true}).toArray(function(error, tasks) {
    res.render('tasks_completed', {
      title: 'Tarefas Completas',
      tasks: tasks || []
    });

  });
};