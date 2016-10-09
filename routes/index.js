
/*
 * GET home page.
 */

/*exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};*/

exports.index = function(req, res, next){

  req.db.tasks.find({completed: false}).toArray(function(error, tasks){

    if (error) return next(error);

    res.render('index', {
      title: 'ToDo List',
      tasks: tasks || []
    });

  });

};