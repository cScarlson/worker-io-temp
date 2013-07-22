
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.peer = function(req, res){
  res.render('peer', { title: 'Express' });
};
