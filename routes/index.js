
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'I am Denny. Nice to meet you.' })
};